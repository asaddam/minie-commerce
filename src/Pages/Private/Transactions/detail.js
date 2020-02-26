import React from 'react';
import PropTypes from 'prop-types';

//material-ui
import { Dialog, DialogTitle, DialogContent, DialogActions,
        Button, Typography, Table, TableRow, TableHead, TableBody,
        TableCell } from '@material-ui/core';

import { currency } from '../../../utils/formatter';

function DetailsDialog({ open, handleClose, transaction }) {

    return <Dialog
        open={open}
        onClose={handleClose}
    >
        <DialogTitle>Transaction No: {transaction.no}</DialogTitle>
        <DialogContent dividers>
            <Table>
                <TableHead>
                    <TableCell>Item</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Subtotal</TableCell>
                </TableHead>
                <TableBody>

                    {transaction.items &&
                        Object.keys(transaction.items).map(k => {

                            const item = transaction.items[k];
                            return (
                                <TableRow key={k}>
                                    <TableCell>{item.nama}</TableCell>
                                    <TableCell>

                                        {item.total}
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
                            </Typography></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose} color="primary">Close</Button>
        </DialogActions>

    </Dialog>
}

DetailsDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    transaksi: PropTypes.object.isRequired
}

export default DetailsDialog;