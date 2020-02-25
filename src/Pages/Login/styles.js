import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    title: {
        textAlign: "center",
        marginBottom: theme.spacing(6)
    },
    paper: {
        marginTop: theme.spacing(8),
        padding: theme.spacing(6)
    },
    buttons: {
        marginTop: theme.spacing(6),
        borderRadius: 8  
    }, 
    forgotPass: {
        marginTop: theme.spacing(3)
    }

}))

export default useStyles;