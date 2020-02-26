import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    listProducts: {
        backgroundColor: theme.palette.background.paper,
        maxHeight: 500,
        overflow: 'auto'
    },
    totalInput: {
        width: 35
    },
    iconLeft: {
        marginRight: theme.spacing(1)
    },
    palette: {
        backgroundColor: '#22c906',
        color: 'white'
    }
}))

export default useStyles;