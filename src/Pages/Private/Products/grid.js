import React, { useState, useEffect } from 'react';

// material-ui
import { Fab, Grid, Card, CardMedia, CardContent, CardActions, Typography,
        IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ImageIcon from '@material-ui/icons/Image';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

//styles
import useStyles from './styles/grid';

// page component
import AddDialog from './add';
import { useFirebase } from '../../../Components/firebaseProvider';
import { useCollection } from 'react-firebase-hooks/firestore';

import AppPageLoading from '../../../Components/AppLoading';

import { currency } from '../../../utils/formatter';

import { Link } from 'react-router-dom';


function GridProducts(){
    const classes = useStyles();

    const { firestore, storage, user } = useFirebase();

    const productCol = firestore.collection(`store/${user.uid}/products`);

    const [snapshot, loading] = useCollection(productCol);

    const [productItems, setProductItems] = useState([]);

    const [openAddDialog, setOpenAddDialog] = useState(false);

    useEffect(() => {
        if (snapshot) {

            setProductItems(snapshot.docs);
        }
    }, [snapshot]);

    if (loading) {

        return <AppPageLoading />
    }

    const handleDelete = productDoc => async e => {

        if (window.confirm('Anda yakin ingin menghapus produk ini?')) {

            await productDoc.ref.delete();
            const fotoURL = productDoc.data().foto;
            if (fotoURL) {

                await storage.refFromURL(fotoURL).delete();
            }

        }
    }
    
    return(
        <>
        <Typography variant="h5" component="h1" paragraph>Product List</Typography>
        {
            productItems.length <= 0 &&
            <Typography>Belum ada data produk</Typography>
        }

        <Grid container spacing={5}>

            {
                productItems.map((productDoc) => {
                    const productData = productDoc.data();
                    return <Grid key={productDoc.id} item={true} xs={12} sm={12} md={6} lg={4}>
                        <Card className={classes.card}>
                            {
                                productData.foto &&
                                <CardMedia
                                    className={classes.foto}
                                    image={productData.foto}
                                    title={productData.nama}
                                />
                            }

                            {
                                !productData.foto && <div className={classes.fotoPlaceholder}>
                                    <ImageIcon
                                        size="large"
                                        color="disabled"
                                    />
                                </div>
                            }
                            <CardContent className={classes.produkDetails}>
                                <Typography variant="h5" noWrap>{productData.nama}</Typography>
                                <Typography variant="subtitle1">Harga: {currency(productData.price)}</Typography>
                                <Typography>Stok: {productData.stock}</Typography>
                            </CardContent>
                            <CardActions className={classes.produkActions}>
                                <IconButton component={Link} to={`/products/edit/${productDoc.id}`}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    onClick={handleDelete(productDoc)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Grid>

                })
            }
        </Grid>
        <Fab
            className={classes.fab}
            color="primary"
            onClick={(e) => {
                setOpenAddDialog(true);
            }}
        >
            <AddIcon />
        </Fab>

        <AddDialog
            open={openAddDialog}
            handleClose={() => {
                setOpenAddDialog(false);
            }}
        />
    </>
    ) 
}

export default GridProducts;