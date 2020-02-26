import React, { useState, useEffect } from 'react';

// material-ui
import { TextField, Button } from '@material-ui/core';

// styles
import useStyles from './styles/store';

// validtor
import isURL from 'validator/lib/isURL';

//firebase hook
import { useFirebase } from '../../../Components/firebaseProvider';
import { useSnackbar } from 'notistack';

import { useDocument } from 'react-firebase-hooks/firestore';

import AppPageLoading from '../../../Components/AppLoading';

// react router
import { Prompt } from 'react-router-dom';

function Store() {
    const classes = useStyles();

    const { firestore, user } = useFirebase();

    const tokoDoc = firestore.doc(`store/${user.uid}`)
    const [snapshot, loading] = useDocument(tokoDoc);
    const { enqueueSnackbar } = useSnackbar();
    const [form, setForm] = useState({
        nama: '',
        address: '',
        phone: '',
        website: ''
    })
    const [error, setError] = useState({
        nama: '',
        address: '',
        phone: '',
        website: ''
    })

    const [isSubmitting, setSubmitting] = useState(false);
    const [isSomethingChange, setSomethingChange] = useState(false);

    useEffect(() => {

        if (snapshot) {

            setForm(snapshot.data());
        }


    }, [snapshot])

    const handleChange = e => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        })

        setError({
            [e.target.name]: ''
        })

        setSomethingChange(true);
    }

    const validate = () => {

        const newError = { ...error };

        if (!form.nama) {
            newError.nama = 'Name must be filled';
        }

        if (!form.address) {
            newError.address = 'Address must be filled';
        }

        if (!form.phone) {
            newError.phone = 'Phone must be filled';
        }

        if (!form.website) {
            newError.website = 'Website must be filled';
        } else if (!isURL(form.website)) {
            newError.website = 'Website is not valid';
        }

        return newError;
    }

    const handleSubmit = async e => {

        e.preventDefault();
        const findErrors = validate();

        if (Object.values(findErrors).some(err => err !== '')) {
            setError(findErrors);
        } else {

            setSubmitting(true);
            try {
                await tokoDoc.set(form, { merge: true });
                setSomethingChange(false);
                enqueueSnackbar('Store data successfully saved.', { variant: 'success' })
                console.log(form)
            }
            catch (e) {

                enqueueSnackbar(e.message, {
                    variant: 'error'
                })
            }
            setSubmitting(false);
        }

    }

    if (loading) {
        return <AppPageLoading />
    }

    return <div className={classes.storeSetting}>
        <form onSubmit={handleSubmit} noValidate>
            <TextField
                id="nama"
                name="nama"
                label="Store Name"
                margin="normal"
                value={form.nama}
                required
                fullWidth
                onChange={handleChange}
                error={error.nama ? true : false}
                helperText={error.nama}
                disabled={isSubmitting}

            />
            <TextField
                id="address"
                name="address"
                label="Store Address"
                margin="normal"
                required
                multiline
                rowsMax={3}
                fullWidth
                value={form.address}
                onChange={handleChange}
                error={error.address ? true : false}
                helperText={error.address}
                disabled={isSubmitting}

            />
            <TextField
                id="phone"
                name="phone"
                label="Phone"
                margin="normal"
                required
                fullWidth
                value={form.phone}
                onChange={handleChange}
                error={error.phone ? true : false}
                helperText={error.phone}
                disabled={isSubmitting}

            />


            <TextField
                id="website"
                name="website"
                label="Store Website"
                margin="normal"
                required
                fullWidth
                value={form.website}
                onChange={handleChange}
                error={error.website ? true : false}
                helperText={error.website}
                disabled={isSubmitting}

            />

            <Button
                type="submit"
                className={classes.actionButton}
                variant="contained"
                color="primary"
                disabled={isSubmitting || !isSomethingChange}
            >
                Save
            </Button>
        </form>

        <Prompt
            when={isSomethingChange}
            message="There are unsaved changes, are you sure you want to leave this page?"
        />
    </div>
}

export default Store;