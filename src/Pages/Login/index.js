import React, { useState } from 'react';

//import komponen materaial-ui and mdb
import { Container, Paper, Grid, TextField, InputAdornment, Typography, Button } from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';


import { Link, Redirect } from 'react-router-dom';

import isEmail from 'validator/lib/isEmail';

//firebase hook
import { useFirebase } from '../../Components/firebaseProvider';

//import styles
import useStyles  from './styles';

//app component
import AppLoading from '../../Components/AppLoading';

function Login(props){
    const { location } = props;
    const classes = useStyles()

    const [form, setForm] = useState({
        email: '',
        password: '',
    })

    const [error, setError] = useState({
        email: '',
        password: '',
    })
    
    const [isSubmitting, setSubmitting] = useState(false);

    const { auth, user, loading } = useFirebase();

    const handleChange = e => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
        setError({
            ...error,
            [e.target.name]: ''
        })
    }

    const validate = () => {
        const newError = { ...error };

        if (!form.email ) {
            newError.email = 'Email address must be filled';
        } else if(!isEmail(form.email)) {
            newError.email = 'Email not valid';
        }

        if (!form.password) {
            newError.password = 'Password must be filled';
        } else if (form.password !== auth.password) {
            newError.password = 'Wrong Password';
        }

        return newError
    }

    const handleSubmit = async e => {
        e.preventDefault();
        const findErrors = validate()

        if(Object.values(findErrors).some(err => err !== '')) {
            setError(findErrors);

        } else {
            try {
                setSubmitting(true);
                await auth.signInWithEmailAndPassword(form.email, form.password)
                window.confirm('test')
            } catch (e) {
                const newError = {};
                switch (e.code) {
                    case 'auth/user-not-found':
                        newError.email = 'Email not registered';
                        break;
                    case 'auth/invalid-email':
                        newError.email = 'Invalid Email';
                        break;
                    case 'auth/wrong-password':
                        newError.password = 'Wrong Password';
                        break;
                    case 'auth/user-disabled':
                        newError.email = 'User disabled';
                        break;
                    default:
                        newError.email = 'There is something wrong, Please try again';
                        break;
                }
                setError(newError);
                setSubmitting(false);
            }
        }
    }

    if (loading) {
        return <AppLoading />
    }

    if (user) {
        const redirecTo = location.state && 
        location.state.from && 
        location.state.from.pathname ?
        location.state.from.pathname : '/';
        return <Redirect to={redirecTo} />
    }
    // var token = jwt.sign({ email: 'baron@gmail.com'}, )
    console.log(user)
    return(
        <Container maxWidth="xs">
            <Paper className={classes.paper}>
                <Typography
                    variant="h5"
                    component="h1"
                    className={classes.title}
                >Login</Typography>
                <form onSubmit={handleSubmit} noValidate>
                    <TextField 
                       id="email"
                       type="email"
                       name="email"
                       margin="normal"
                       label="Email Address"
                       InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon />
                          </InputAdornment>
                        ),
                      }}
                       fullWidth
                       required
                       value={form.email}
                       onChange={handleChange}
                       helperText={error.email}
                       error={error.email ? true : false}
                       disabled={isSubmitting}
                    />
                    <TextField 
                       id="password"
                       type="password"
                       name="password"
                       margin="normal"
                       label="Password"
                       InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon />
                          </InputAdornment>
                        ),
                      }}
                       fullWidth
                       required
                       value={form.password}
                       onChange={handleChange}
                       helperText={error.password}
                       error={error.password ? true : false}
                       disabled={isSubmitting} 
                    />
                

                    <Grid container className={classes.buttons}>
                        <Grid item xs>
                            <Button 
                                variant="contained"
                                disabled={isSubmitting}
                                component={Link}
                                to="/"
                                type="submit"
                                color="primary"
                                >Login</Button>
                        </Grid>
                        <Grid item>
                            <Button 
                                variant="contained"
                                disabled={isSubmitting}
                                component={Link}    
                                to="/registration"
                                >Register</Button>
                        </Grid>
                    </Grid>
                    <div className={classes.forgotPass}>
                        <Typography component={Link} to="/forget-pass">
                            Forget Password ?
                        </Typography>
                    </div>

                </form>
            </Paper>
        </Container>
    ) 
}

export default Login;