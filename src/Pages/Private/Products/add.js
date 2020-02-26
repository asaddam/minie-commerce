import React, { useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { Button, TextField, Dialog, DialogActions, 
        DialogContent, DialogTitle } from '@material-ui/core';

import { useFirebase } from '../../../Components/firebaseProvider';

import { withRouter } from 'react-router-dom';

const AddDialog = ({ history, open, handleClose }) => {

    const { firestore, user } = useFirebase();

    const productCol = firestore.collection(`store/${user.uid}/products`);

    const [nama, setNama] = useState('');

    const [error, setError] = useState('');

    const [isSubmitting, setSubmitting] = useState(false);

    const handleSave = async e => {

        setSubmitting(true);
        try {

            if (!nama) {

                throw new Error('Product Name must be filled!');
            }

            const newProduct = await productCol.add({ nama });

            history.push(`products/edit/${newProduct.id}`);

        } catch (e) {

            setError(e.message)

        }
        setSubmitting(false);
    }
    return <Dialog
        disableBackdropClick={isSubmitting}
        disableEscapeKeyDown={isSubmitting}
        open={open}
        onClose={handleClose}
    >
        <DialogTitle>Create New Product</DialogTitle>
        <DialogContent dividers>
            <TextField
                id="nama"
                label="Product Name"
                value={nama}
                onChange={(e) => {
                    setError('');
                    setNama(e.target.value);
                }}
                helperText={error}
                error={error ? true : false}
                disabled={isSubmitting}
            />
        </DialogContent>
        <DialogActions>
            <Button
                disabled={isSubmitting}
                onClick={handleClose}
            >Cancel</Button>
            <Button
                disabled={isSubmitting}
                onClick={handleSave} color="primary">Save</Button>
        </DialogActions>
    </Dialog>

}

AddDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired
}

export default withRouter(AddDialog);