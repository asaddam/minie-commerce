import React, { useRef, useState} from 'react';

// material ui
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useFirebase } from '../../../Components/firebaseProvider';

//styles
import useStyles from './styles/user';
import { useSnackbar } from 'notistack';

import isEmail from 'validator/lib/isEmail';


function User(){

    const classes = useStyles();
    const { user } = useFirebase();
    const [error, setError] = useState({
        displayName: '',
        email: '',
        password: ''
    })
    const { enqueueSnackbar } = useSnackbar();
    const [isSubmitting, setSubmitting] = useState(false);
    const displayNameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const saveDisplayName = async (e) => {

        const displayName = displayNameRef.current.value;
        console.log(displayName);

        if (!displayName) {
            setError({
                displayName: 'Name must be filled'
            })
        } else if (displayName !== user.displayName) {

            setError({
                displayName: ''
            })
            setSubmitting(true);
            await user.updateProfile({
                displayName
            })
            setSubmitting(false);
            enqueueSnackbar('User data succesfully updated', { variant: 'success' })
        }
    }

    const updateEmail = async (e) => {
        const email = emailRef.current.value;

        if (!email) {
            setError({
                email: 'Email must be filled'
            })
        }
        else if (!isEmail(email)) {
            setError({
                email: 'Email is not valid'
            })
        }
        else if (email !== user.email) {
            setError({
                email: ''
            })
            setSubmitting(true)
            try {
                await user.updateEmail(email);

                enqueueSnackbar('Email successfully updated', { variant: 'success' });
            }
            catch (e) {
                let emailError = '';
                switch (e.code) {
                    case 'auth/email-already-in-use':
                        emailError = 'Email already taken';
                        break;
                    case 'auth/invalid-email':
                        emailError = 'Email is not valid';
                        break;
                    case 'auth/requires-recent-login':
                        emailError = "Please logout, then relog";
                        break;
                    default:
                        emailError = 'There something mistake, please try again!';
                        break;
                }

                setError({
                    email: emailError
                })

            }

            setSubmitting(false)
        }

    }
    const sendEmailVerification = async (e) => {

        const actionCodeSettings = {
            url: `${window.location.origin}/login`
        };

        setSubmitting(true);
        await user.sendEmailVerification(actionCodeSettings);
        enqueueSnackbar(`Verification email has been sent to ${emailRef.current.value}`, { variant: 'success' });
        setSubmitting(false);
    }

    const updatePassword = async (e) => {

        const password = passwordRef.current.value;

        if (!password) {

            setError({
                password: 'Password must be filled'
            })
        } else {
            setSubmitting(true)
            try {

                await user.updatePassword(password);

                enqueueSnackbar('Password successfully updated', { variant: 'success' })
            }
            catch (e) {

                let errorPassword = '';

                switch (e.code) {

                    case 'auth/weak-password':
                        errorPassword = 'Password too weak';
                        break;
                    case 'auth/requires-recent-login':
                        errorPassword = 'Please logout, then relog';
                        break;
                    default:
                        errorPassword = 'There is something mistake, please try again';
                        break;

                }

                setError({
                    password: errorPassword
                })

            }
            setSubmitting(false);
        }

    }
    
    return<div className={classes.userSetting}>
    <TextField
        id="displayName"
        name="displayName"
        label="Name"
        margin="normal"
        defaultValue={user.displayName}
        inputProps={{
            ref: displayNameRef,
            onBlur: saveDisplayName
        }}
        disabled={isSubmitting}
        helperText={error.displayName}
        error={error.displayName ? true : false}
    />

    <TextField
        id="email"
        name="email"
        label="Email"
        type="email"
        margin="normal"
        defaultValue={user.email}
        inputProps={{
            ref: emailRef,
            onBlur: updateEmail
        }}
        disabled={isSubmitting}
        helperText={error.email}
        error={error.email ? true : false}

    />

    {
        user.emailVerified ?
            <Typography color="primary" variant="subtitle1">Email has been verified</Typography>
            :
            <Button
                variant="outlined"
                onClick={sendEmailVerification}
                disabled={isSubmitting}
            >
                Send Email verification
            </Button>

    }

    <TextField
        id="password"
        name="password"
        label="New Password"
        type="password"
        margin="normal"
        inputProps={{
            ref: passwordRef,
            onBlur: updatePassword
        }}
        autoComplete="new-password"
        disabled={isSubmitting}
        helperText={error.password}
        error={error.password ? true : false}

    />

    </div>

}

export default User;