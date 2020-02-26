import React, { useState, useEffect } from 'react';

// material-ui
import { TextField, Button, Grid, Typography } from '@material-ui/core';

import UploadIcon from '@material-ui/icons/CloudUpload';
import SaveIcon from '@material-ui/icons/Save';

import { useFirebase } from '../../../Components/firebaseProvider';
import { useDocument } from 'react-firebase-hooks/firestore';

import AppPageLoading from '../../../Components/AppLoading';
import { useSnackbar } from 'notistack';

import useStyles from './styles/edit';

import { Prompt } from 'react-router-dom';

function EditProducts({ match }){

    const classes = useStyles();
    const { firestore, storage, user } = useFirebase();
    const { enqueueSnackbar } = useSnackbar();
    const productDoc = firestore.doc(`store/${user.uid}/products/${match.params.productId}`);

    const productStorageRef = storage.ref(`store/${user.uid}/products`);

    const [snapshot, loading] = useDocument(productDoc);

    const [form, setForm] = useState({
        nama: '',
        sku: '',
        price: 0,
        stock: 0,
        description: ''
    });

    const [error, setError] = useState({
        nama: '',
        sku: '',
        price: '',
        stock: '',
        description: ''
    })

    const [isSubmitting, setSubmitting] = useState(false);

    const [isSomethingChange, setSomethingChange] = useState(false);

    useEffect(() => {

        if (snapshot) {

            setForm(currentForm => ({
                ...currentForm,
                ...snapshot.data()
            }));
        }
    }, [snapshot]);

    const handleChange = e => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        })

        setError({
            ...error,
            [e.target.name]: ''
        })

        setSomethingChange(true);
    }

    const validate = () => {

        const newError = { ...error };

        if (!form.nama) {
            newError.nama = 'Product name must be filled';
        }

        if (!form.price) {
            newError.price = 'Product price must be filled';
        }

        if (!form.stock) {
            newError.stock = 'Product stock must be filled';
        }

        return newError;

    }

    const handleSubmit = async e => {
        e.preventDefault();

        const findError = validate();

        if (Object.values(findError).some(err => err !== '')) {
            setError(findError);
        } else {
            setSubmitting(true);
            try {
                await productDoc.set(form, { merge: true });
                enqueueSnackbar('Product data has been saved', { variant: 'success' })
                setSomethingChange(false);
            }
            catch (e) {
                enqueueSnackbar(e.message, { variant: 'error' })
            }
            setSubmitting(false);
        }

    }

    const handleUploadFile = async (e) => {
        const file = e.target.files[0];

        if (!['image/png', 'image/jpeg'].includes(file.type)) {

            setError(error => ({
                ...error,
                foto: `File type not supported: ${file.type}`
            }))
        }
        else if (file.size >= 512000) {
            setError(error => ({
                ...error,
                foto: `File size too big > 500KB`
            }))
        } else {

            const reader = new FileReader();

            reader.onabort = () => {

                setError(error => ({
                    ...error,
                    foto: `Proses pembacaan file dibatalkan`
                }))
            }

            reader.onerror = () => {

                setError(error => ({
                    ...error,
                    foto: 'File tidak bisa dibaca'
                }))
            }

            reader.onload = async () => {
                setError(error => ({
                    ...error,
                    foto: ''
                }))
                setSubmitting(true);
                try {
                    const fotoExt = file.name.substring(file.name.lastIndexOf('.'));

                    const fotoRef = productStorageRef.child(`${match.params.productId}${fotoExt}`);

                    const fotoSnapshot = await fotoRef.putString(reader.result, 'data_url');

                    const fotoUrl = await fotoSnapshot.ref.getDownloadURL();

                    setForm(currentForm => ({
                        ...currentForm,
                        foto: fotoUrl
                    }));

                    setSomethingChange(true);
                } catch (e) {
                    setError(error => ({
                        ...error,
                        foto: e.message
                    }))


                }

                setSubmitting(false);

            }

            reader.readAsDataURL(file);

        }
    }

    if (loading) {

        return <AppPageLoading />
    }
    
    return(
        <div>
            <Typography variant="h5" component="h1">Edit Product: {form.nama}</Typography>
            <Grid container alignItems="center" justify="center">
            <Grid item xs={12} sm={6}>
                <form id="produk-form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        id="nama"
                        name="nama"
                        label="Product Name"
                        margin="normal"
                        fullWidth
                        required
                        value={form.nama}
                        onChange={handleChange}
                        helperText={error.nama}
                        error={error.nama ? true : false}
                        disabled={isSubmitting}
                    />
                    <TextField
                        id="sku"
                        name="sku"
                        label="SKU Produk"
                        margin="normal"
                        fullWidth
                        value={form.sku}
                        onChange={handleChange}
                        helperText={error.sku}
                        error={error.sku ? true : false}
                        disabled={isSubmitting}
                    />
                    <TextField
                        id="price"
                        name="price"
                        label="Product Price"
                        type="number"
                        margin="normal"
                        required
                        fullWidth
                        value={form.price}
                        onChange={handleChange}
                        helperText={error.price}
                        error={error.price ? true : false}
                        disabled={isSubmitting}
                    />
                    <TextField
                        id="stock"
                        name="stock"
                        label="Product Stocks"
                        type="number"
                        margin="normal"
                        required
                        fullWidth
                        value={form.stock}
                        onChange={handleChange}
                        helperText={error.stock}
                        error={error.stock ? true : false}
                        disabled={isSubmitting}
                    />
                    <TextField
                        id="description"
                        name="description"
                        label="Description"
                        margin="normal"
                        multiline
                        rowsMax={3}
                        fullWidth
                        value={form.description}
                        onChange={handleChange}
                        helperText={error.description}
                        error={error.description ? true : false}
                        disabled={isSubmitting}
                    />
                </form>
            </Grid>
            <Grid item xs={12} sm={6}>
                <div className={classes.uploadFotoProduk}>
                    {form.foto &&
                        <img src={form.foto} className={classes.previewFotoProduk} alt={`Foto Produk ${form.nama}`} />}
                    <input
                        className={classes.hideInputFile}
                        type="file"
                        id="upload-foto-produk"
                        accept="image/jpeg,image/png"
                        onChange={handleUploadFile}
                    />
                    <label htmlFor="upload-foto-produk">
                        <Button
                            disabled={isSubmitting}
                            variant="outlined"
                            component="span"
                        >Upload Foto <UploadIcon className={classes.iconRight} /></Button>
                    </label>
                    {error.foto &&
                        <Typography color="error">
                            {error.foto}
                        </Typography>}
                </div>
            </Grid>
                <Grid item xs={12}>
                    <div className={classes.actionButtons}>
                        <Button
                            disabled={isSubmitting || !isSomethingChange}
                            form="produk-form"
                            type="submit"
                            color="primary"
                            variant="contained">
                            <SaveIcon className={classes.iconLeft} />
                            Save
                    </Button>
                    </div>
                </Grid>
            </Grid>
            <Prompt
                when={isSomethingChange}
                message="There are unsaved changes, are you sure you want to leave this page?"
            />
        </div>
    ) 
}

export default EditProducts;