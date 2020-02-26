import React, { useState, useEffect } from 'react';

// material-ui 
import { Typography, Card, CardContent, CardActions, Grid, 
        IconButton }from '@material-ui/core';

//icons
import DeleteIcon from '@material-ui/icons/Delete';
import ViewIcon from '@material-ui/icons/Visibility';

import { useFirebase } from '../../../Components/firebaseProvider';

import { useCollection } from 'react-firebase-hooks/firestore';
import { currency } from '../../../utils/formatter';
import format from 'date-fns/format';

import AppPageLoading from '../../../Components/AppLoading';

import useStyles from './styles';

import DetailsDialog from './detail';

function  Transactions(){
    const classes = useStyles();
    const { firestore, user } = useFirebase();

    const transactionCol = firestore.collection(`store/${user.uid}/transactions`);

    const [snapshot, loading] = useCollection(transactionCol);

    const [transactionItems, setTransactionItems] = useState([]);

    const [details, setDetails] = useState({
        open: false,
        transaction: {}
    })

    useEffect(() => {

        if (snapshot) {
            setTransactionItems(snapshot.docs);
        }
    }, [snapshot])

    const handleCloseDetails = (e) => {

        setDetails({
            open: false,
            transaction: {}
        })
    }

    const handleOpenDetails = transactionDoc => e => {

        setDetails({
            open: true,
            transaction: transactionDoc.data()
        })
    }


    const handleDelete = transactionDoc => async e => {

        if (window.confirm('Are you sure you want to delete this transaction?')) {
            await transactionDoc.ref.delete();
        }
    }

    if (loading) {
        return <AppPageLoading />
    }

    return (<>
        <Typography component="h1" variant="h5" paragraph>Transaction Lists</Typography>
        {
            transactionItems.length <= 0 &&
            <Typography>There is no transaction data</Typography>
        }

        <Grid container spacing={5}>
            {
                transactionItems.map(transactionDoc => {
                    const transactionData = transactionDoc.data();
                    return <Grid key={transactionDoc.id} item xs={12} sm={12} md={6} lg={4}>
                        <Card className={classes.card}>
                            <CardContent className={classes.transactionSummary}>
                                <Typography variant="h5" noWrap>No: {transactionData.no}</Typography>
                                <Typography>Amount: {currency(transactionData.total)}</Typography>
                                <Typography>
                                    Date: {format(new Date(transactionData.timestamp), 'dd-mm-yyyy hh:mm')}
                                </Typography>
                            </CardContent>
                            <CardActions className={classes.transactionActions}>
                                <IconButton
                                    onClick={handleOpenDetails(transactionDoc)}
                                ><ViewIcon /></IconButton>
                                <IconButton onClick={handleDelete(transactionDoc)}><DeleteIcon /></IconButton>
                            </CardActions>
                        </Card>
                    </Grid>
                })
            }
        </Grid>
        <DetailsDialog
            open={details.open}
            handleClose={handleCloseDetails}
            transaction={details.transaction}
        />

        </>
    ) 
}

export default  Transactions;