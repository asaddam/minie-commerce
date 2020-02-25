import React, { useState, useEffect }from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useSnackbar } from 'notistack';
import format from 'date-fns/format'

//material-ui components
import { List, Button, ListItem, ListSubheader, ListItemAvatar,
        ListItemIcon, ListItemText, Avatar, Typography,
        Grid, TextField, Table, TableRow, TableHead,
        TableBody, TableCell} from '@material-ui/core';

//icons
import ImageIcon from '@material-ui/icons/Image';
import SaveIcon from '@material-ui/icons/Save';

import { useFirebase } from '../../../Components/firebaseProvider';
import useStyles from './styles';
import { currency } from '../../../utils/formatter';
import AppPageLoading from '../../../Components/AppLoading';

function Home(){
    const classes = useStyles();
    const { firestore, user, auth } = useFirebase();
    const { enqueueSnackBar } = useSnackbar();
    const todayDateString = format(new Date(), 'yyyy-mm-dd');
    const productCol = firestore.collection(`store/${user.uid}/product`);
    const transactionCol = firestore.collection(`store/${user.uid}/transaction`);
    const [snapshotProduct, loadingProduct] = useCollection(productCol);
    const [snapshotTransaction, loadingTransaction] = useCollection(transactionCol.where('date', '==', todayDateString));
    const initialTransaction = {
        no: "",
        items: {

        },
        total: 0,
        date: todayDateString
    };
    const [transaction, setTransaction] = useState(initialTransaction);
    const [isSubmitting, setSubmitting] = useState(false);
    const [productItems, setProductItems] = useState([]);
    const [filterProduct, setFilterProduct] = useState('');
    
    useEffect(() => {
        if (snapshotProduct) {

            setProductItems(snapshotProduct.docs.filter((productDoc) => {
               if (filterProduct) {
                   return productDoc.data().nama.toLowerCase().includes(filterProduct.toLowerCase());

               } 
               return true;
            }));
        }
    }, [snapshotProduct, filterProduct])

    useEffect(() => {

        if(snapshotTransaction) {
            setTransaction(transaction => ({
                ...transaction,
                no: `${transaction.date}/${snapshotTransaction.docs.length + 1}`
            }))
        } else {
            setTransaction(transaction => ({
                ...transaction,
                no: `${transaction.date}/1`
            }))
        }
    }, [snapshotTransaction])

    const addItem = productDoc => e => {
        let newItem = { ...transaction.items[productDoc.id] };
        const productData = productDoc.data();

        if(newItem.sum) {
            newItem.sum = newItem.sum + 1;
            newItem.subtotal = productData.price * newItem.sum;
        } else {
            newItem.sum = 1;
            newItem.price = productData.price;
            newItem.subtotal = productData.price;
            newItem.name = productData.name;
        }

        const newItems = {
            ...transaction.items,
            [productDoc.id]: newItem
        };
        if (newItem.sum > productData.stock) {
            enqueueSnackBar('Jumlah melebihi stok produk', { variant: 'error' })
        } else {

            setTransaction({
                ...transaction,
                item: newItems,
                total: Object.keys(newItems).reduce((total, k) => {
                    const item = newItem[k];
                    return total + parseInt(item.subtotal);
                }, 0)
            })
        }
    }

    const handleChangeTotal = k => e => {
        let newItem = {
            ...transaction.items
        };
        
        newItem.sum = parseInt(e.target.value);
        newItem.subtotal = newItem.price * newItem.sum;
        
        let newItems = {
            ...transaction.items,
            [k]: newItem
        };

        const productDoc = productItems.find(item => item.id === k);
        const productData = productDoc.data()
        if (newItem.sum > productData.stock) {
            enqueueSnackBar('Jumlah melebihi stok produk', { variant: 'error' })
        } else {
            setTransaction({
                ...transaction,
                items: newItems,
                total: Object.keys(newItems).reduce((total, k) => { 
                    const item = newItems[k];
                    return total + parseInt(item.subtotal);
                }, 0)
            })
        }
    }
         const saveTransaction = async (e) => {

             if (Object.keys(transaction.items).length <= 0) {
                 enqueueSnackBar('There is no transaction to save', { variant: 'error' })
                 return false;
             }
         

            setSubmitting(true);
            try {
                await transactionCol.add({
                    ...transaction,
                    timestamp: Date.now()
                })

                // update stock produk menggunakan transactions

                await firestore.runTransaction(transaction => {
                    const productIDs = Object.keys(transaction.items);
                    return Promise.all(productIDs.map(productId => {
                        const productRef = firestore.doc(`store/${user.uid}/product/${productId}`);

                        return transaction.get(productRef).then((productDoc) => {

                            if (!productDoc.exists) {
                                throw Error('There is no product');
                            }

                            let newStock = parseInt(productDoc.data().stock) - parseInt(transaction.items[productId].sum);

                            if ( newStock < 0) {
                                newStock = 0;
                            }

                            transaction.update(productRef, { stock: newStock });
                        })
                    }));
                })

                enqueueSnackBar('Transaction has been save', { variant: 'success'})
                setTransaction(transaction => ({
                    ...initialTransaction,
                    no: transaction.no
                }));
            }
            catch (e) {
                enqueueSnackBar(e.message, { variant: 'error'});
            }

            setSubmitting(false);
    }

    if (loadingProduct || loadingTransaction) {
        return <AppPageLoading />

    }


    return (
        <>
            <Typography variant="h5" component="h1" paragraph>Create New Transactions</Typography>
            <Grid container spacing={5}>
                <Grid item xs>
                    <TextField
                        label="No Transactions"
                        value={transaction.no}
                        InputProps={{
                            readOnly: true
                        }}
                    />
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={saveTransaction}
                        disabled={isSubmitting}
                    >
                        <SaveIcon className={classes.iconLeft} />
                        Save Transaction
                    </Button>
                </Grid>
            </Grid>
            <Grid container spacing={5}>
                <Grid item xs={12} md={8}>
                    <Table>
                        <TableHead>
                            <TableCell>Item</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Subtotal</TableCell>
                        </TableHead>
                        <TableBody>
                            {
                                Object.keys(transaction.items).map(k => {
                                    const item = transaction.items[k];
                                    return (
                                        <TableRow key={k}>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell>
                                                <TextField
                                                    disabled={isSubmitting}
                                                    className={classes.inputJumlah}
                                                    value={item.sum}
                                                    type="number"
                                                    onChange={handleChangeTotal(k)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {currency(item.price)}
                                            </TableCell>
                                            <TableCell>
                                                {currency(item.subtotal)}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                            <TableRow>
                                <TableCell colSpan={3}>
                                    <Typography variant="subtitle2">
                                        Total
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="h6">
                                        {currency(transaction.total)}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Grid>
                <Grid item xs={12} md={4}>
                    <List 
                        className={classes.listProducts}
                        component="nav"
                        subheader={
                            <ListSubheader component="div">
                                <TextField
                                    autoFocus
                                    label="Search Product"
                                    fullWidth
                                    margin="normal"
                                    onChange={e => { setFilterProduct(e.target.value)}}
                                />
                            </ListSubheader>
                        }
                    >
                        {
                            productItems.map((productDoc) => {
                                const productData = productDoc.data();
                                return <ListItem
                                    key={productDoc.id}
                                    button
                                    disabled={!productData.stock || isSubmitting }
                                    onClick={addItem(productDoc)}
                                >
                                    {
                                        productData.photo ?
                                            <ListItemAvatar>
                                                <Avatar
                                                    src={productData.photo}
                                                    alt={productData.name}
                                                />
                                            </ListItemAvatar>
                                            :
                                            <ListItemIcon>
                                                <ImageIcon />
                                            </ListItemIcon>
                                    }

                                    <ListItemText
                                    primary={productData.name}
                                    secondary={`Stock: ${productData.stock || 0} `}
                                    />
                                </ListItem>
                            })
                        }
                    </List>

                </Grid>

            </Grid>
            <div>halmn Home</div>
            <Button onClick={(e) => auth.signOut()}>signout</Button>
        </>
    ) 
}

export default Home