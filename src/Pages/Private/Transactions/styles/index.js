import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
    card: {
        display: 'flex'
    },
    transactionSummary: {
        flex: '2 0 auto'
    },
    transactionActions: {
        flexDirection: 'column'
    },
    palette: {
        primary: '#22c906',
    }

}))


export default useStyles;