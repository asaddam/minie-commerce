import React, { useState } from 'react';

//import komponen materaial-ui and mdb
import { Container, Paper, Grid, TextField, Typography, Button } from '@material-ui/core';

import { Link, Redirect } from 'react-router-dom';

import isEmail from 'validator/lib/isEmail';

//firebase hook
import { useFirebase } from '../../Components/firebaseProvider';

import useStyles from './styles';

//notistack hook
import { useSnackbar } from 'notistack';

//app component
import AppLoading from '../../Components/AppLoading';

function ForgetPass(){
    const classes = useStyles()

    const [form, setForm] = useState({
        email: ''
    })

    const [error, setError] = useState({
        email: ''
    })
    
    const [isSubmitting, setSubmitting] = useState(false);

    const { auth, user, loading } = useFirebase();

    const { enqueueSnackbar } = useSnackbar();

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
                const actionCodeSettings = {
                    url: `${window.location.origin}/login`
                }
                await auth.sendPasswordResetEmail(form.email, actionCodeSettings)
                enqueueSnackbar(`We've sent an email to ${form.email}. Click the link in the email to reset your password.`, {
                    variant: 'success'
                })
                setSubmitting(false);

            } catch (e) {
                const newError = {};
                switch (e.code) {
                    case 'auth/user-not-found':
                        newError.email = 'Email not registered';
                        break;
                    case 'auth/invalid-email':
                        newError.email = 'Invalid Email';
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
        
        return <Redirect to="/" />
    }
    
    console.log(user)
    return(
        <Container maxWidth="xs">
            <Paper className={classes.paper}>
                <Typography
                    variant="h5"
                    component="h1"
                    className={classes.title}
                >Forget Password</Typography>
                <form onSubmit={handleSubmit} noValidate>
                    <TextField 
                       id="email"
                       type="email"
                       name="email"
                       margin="normal"
                       label="Email Address"
                       fullWidth
                       required
                       value={form.email}
                       onChange={handleChange}
                       helperText={error.email}
                       error={error.email ? true : false}
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
                                >Send</Button>
                        </Grid>
                        <Grid item>
                            <Button 
                                variant="contained"
                                disabled={isSubmitting}
                                component={Link}    
                                to="/login"
                                >Login</Button>
                        </Grid>
                    </Grid>

                </form>
            </Paper>
        </Container>
    ) 
}

export default ForgetPass;