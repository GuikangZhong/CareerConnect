import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

const Message = ({message, open, handleClose, type}) => {
    return (
        <Snackbar open={open} autoHideDuration={5000} onClose={handleClose} TransitionProps={{appear: false}}>
            <>
                {type === "error" && 
                    <Alert onClose={handleClose} severity="error">
                        {message}
                    </Alert>
                }
                {type === "success" && 
                    <Alert onClose={handleClose} severity="success">
                        {message}
                    </Alert>
                }
            </>
        </Snackbar>
    );
}

export default Message;