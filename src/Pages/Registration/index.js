import React, { useState } from 'react';

//import komponen materaial-ui and mdb
import { Container, Paper, Grid, TextField, InputAdornment, Button, Typography } from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';


import { Link, Redirect } from 'react-router-dom';

import isEmail from 'validator/lib/isEmail';

import { useSnackbar } from 'notistack';


//firebase hook
import { useFirebase } from '../../Components/firebaseProvider';

//import styles
import useStyles  from './styles';

//app component
import AppLoading from '../../Components/AppLoading';

function Registration(){
    const classes = useStyles()

    const [form, setForm] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    })

    const [error, setError] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    })
    
    const [errPass, setPass] = useState({
        num: false,
        spec: false
    })

    const [isSubmitting, setSubmitting] = useState(false);

    const { auth, user, loading } = useFirebase();

    const handleChange = e => {
        var num = /[0-9]/
        var spec = /[!@#$%^&*;]/
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
        setError({
            ...error,
            [e.target.name]: ''
        })
        setPass({
            num: num.test(e.target.value),
            spec: spec.test(e.target.value)
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
        } else if (form.password.length < 8) {
            newError.password = 'Password must be 8 or more character'
        } else if(errPass.num === false && errPass.spec === false){
                newError.password = 'Password must be contain number and special character'
            }
        
        
        if (!form.confirmPassword) {
            newError.confirmPassword = 'Confirm password must be filled';
        } else if (form.confirmPassword !== form.password) {
            newError.confirmPassword = 'Those password didn\'t match. Try again.'; 
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
                await auth.createUserWithEmailAndPassword(form.email, form.password)
                
            } catch (e) {
                const newError = {};
                switch (e.code) {
                    case 'auth/email-already-in-use':
                        newError.email = 'Email already in use';
                        break;
                    case 'auth/invalid-email':
                        newError.email = 'Invalid Email';
                        break;
                    case 'auth/weak-password':
                        newError.password = 'Weak Password';
                        break;
                    case 'auth/operation-not-allowed':
                        newError.email = 'Email or Password not allowed';
                        break;
                    default:
                        newError.email = 'There is something wrong, Please try again';
                        break;
                }
                setError(newError);
                // setSubmitting(false);
            }
        }
    }

    if (loading) {
        return <AppLoading />
    }

    if (user) {
        return <Redirect to="/login" />
    }
    
    console.log(user)
    return <Container maxWidth="xs">
            <Paper className={classes.paper}>
                <Typography
                    variant="h5"
                    component="h1"
                    className={classes.title}
                >Create New Acccount</Typography>
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
                    <TextField 
                       id="confirmPassword"
                       type="password"
                       name="confirmPassword"
                       margin="normal"
                       label="Confirm Password"
                       InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon />
                          </InputAdornment>
                        ),
                      }}
                       fullWidth
                       required
                       value={form.confirmPassword}
                       onChange={handleChange}
                       helperText={error.confirmPassword}
                       error={error.confirmPassword ? true : false}
                       disabled={isSubmitting}
                    />

                    <Grid container className={classes.buttons}>
                        <Grid item xs>
                            <Button 
                                color="primary" 
                                variant="contained"
                                type="submit"
                                size="large"
                                disabled={isSubmitting}
                                >Register</Button>
                        </Grid>
                        <Grid item>
                            <Button 
                                variant="contained"
                                disabled={isSubmitting}
                                component={Link}
                                to="/login"
                                >Login</Button>
                        </Grid>
                        <div id="success">

                        </div>
                    </Grid>

                </form>
            </Paper>
        </Container>
     
}

export default Registration;