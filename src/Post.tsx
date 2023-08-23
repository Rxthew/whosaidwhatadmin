import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar'
import Button from "@mui/material/Button";
import Box from '@mui/material/Box';
import CircularProgress  from '@mui/material/CircularProgress';
import Container from '@mui/material/Container'
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import TextField  from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import * as React from 'react'; 
import { useParams } from "react-router-dom";
import { PostContextProvider } from './helpers/contexts';
import { useErrorStates, useIndexData, useLoadingState, useNotifications, useNotificationsDispatch, useResetLoadingState } from "./helpers/hooks";
import { CommentInterface, FormDialogProps, NotificationReducerInterface } from "./helpers/types";
import { produceCommentFormProps } from './helpers/services';
import { extractPostById, regulariseDate, restoreOriginalErrorState  } from "./helpers/utils";


const FormDialog = function(props: FormDialogProps){
    const [open, setOpen] = React.useState(false);
    const [errors, setErrors] = useErrorStates(['_id', 'content', 'post', 'title', 'user']); 
    const { resetIndexData } = useIndexData();
    const setNotifications = useNotificationsDispatch();
    const resetLoadingState = useResetLoadingState(); 
     
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
      restoreOriginalErrorState(setErrors);
    };

    const handleSubmit = props.handleSubmitConstructor({resetIndexData, resetLoadingState, setErrors, setNotifications});

    const FormButton = function(){
      return props.button(handleClickOpen)
    };
  
    return (
      <div>
        <FormButton />
        <Dialog fullWidth open={open} onClose={handleClose}>
        {errors.general.error && (
        <Typography component="h2" variant="h6" sx={{color: "red", p:2}}>
        Error: {errors.general.msg}
        </Typography>
        )}
        {errors.content.error && (
        <Typography component="h2" variant="h6" sx={{color: "red", p:2}}>
        Error: {errors.content.msg}
        </Typography>
        )}
          <DialogTitle>{props.inputLabel}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {props.inputText}
            </DialogContentText>
            {props.delete ? 
              (<form id="dialogForm" onSubmit={handleSubmit}></form>) 
               : (
              <form id="dialogForm" onSubmit={handleSubmit}>
                <TextField 
                autoFocus
                defaultValue={props.content || ""}
                fullWidth
                id="content"
                margin="dense"
                multiline
                name="content"
                label={props.inputLabel}
                rows={8}
                size="medium"
                type="text"
                variant="standard"
                sx={{whiteSpace:"pre-line"}} 
                />
              </form>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" form="dialogForm">{props.submitLabel ? props.submitLabel : "Submit"}</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

const StatusNotification = function(){

  const notifications = useNotifications();
  const dispatch = useNotificationsDispatch();

  const handleClose = function(){ 
    const result = dispatch && dispatch({type: 'Default'});
    return result === null ? console.error('Notification dispatch setter is null') : result
  };

  const convertToSnackbar = function(key: keyof NotificationReducerInterface ){
    
    return notifications && (
      <Box key={key}>
        <Snackbar open={notifications[key]['status']} autoHideDuration={7000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success">
            {notifications[key]['message']}
          </Alert>
        </Snackbar> 
      </Box>
    )
  }
  const notificationKeys = notifications && Object.keys(notifications);
  return (
    <>
      {notificationKeys === null ? console.error('Notifications are null') : notificationKeys.map((key) => convertToSnackbar(key as keyof NotificationReducerInterface))}
    </>
  )
}

  const {
         addCommentProps, 
         deleteCommentProps,
         editCommentProps
        } = produceCommentFormProps();  
 

const Comment = function(props: CommentInterface){ 

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const { user } = useIndexData();
  const date = regulariseDate(props.date);
  
  const isUserCommentOwner = user && props.user && user?._id === props.user?._id;
  const isUserPrivilegedMember = user?.member_status === 'privileged';
  const isUserPrivilegedOwner = isUserCommentOwner && isUserPrivilegedMember;
  const isUserAdminMember = user?.member_status === 'admin'; 


  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
  <Box sx={{display: 'flex'}}>
    <Paper sx={{p:2, flexGrow: '1'}} variant='outlined'>
      <Grid container spacing={6} wrap='nowrap'>
        <Grid item> 
          <Typography variant='overline'>{props.user?.username || 'Anonymous'}:</Typography>      
        </Grid>
        <Grid item>
          <Typography variant='subtitle1' color='text.secondary'>{date}</Typography>
        </Grid>
        {(isUserAdminMember || isUserPrivilegedOwner) && (
        <Grid item sx={{ml:'auto'}}>
          <Button onClick={handleClick}>
            <MoreHorizIcon  />
          </Button>
          <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
          }}
          transformOrigin={{
          vertical: 10,
          horizontal: 130,
          }}
          sx={{
          cursor: 'pointer'
          }}
        >
            <Stack sx={{p:1}}>
              <FormDialog {...editCommentProps({content: props.content, id: props._id, post: props.post, userId: user._id})} />
              <FormDialog {...deleteCommentProps(props._id, user._id)} />      
            </Stack>
          </Popover>
        
      </Grid>
      )}
      </Grid>
      <Typography gutterBottom={true} paragraph={true} sx={{whiteSpace:"pre-line"}} >
            {props.content}
      </Typography>  
    </Paper>
  </Box>    
  );   
}; 

const Post = function Post(){   
    const { postId } = useParams();
    const { user, posts } = useIndexData();
    const { loading, resetLoadingState } = useLoadingState();
    const post = postId && posts && posts.length > 0 ? extractPostById(postId, posts) : null;
    const date = post && post.date ? regulariseDate(post.date) : ''
  
    return (
       <>
       {PostContextProvider(
       <Container sx={{py:4}}>
          {loading && (
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                <CircularProgress size={60}/>
            </Box>)}
          {post && !loading && (
              <>
              <Typography component='h1' variant='h4'>{post.title}</Typography>
              <Typography variant='subtitle1' color="text.secondary">{date}</Typography>
              <Typography gutterBottom={true} paragraph={true} sx={{letterSpacing: '0.08rem', lineHeight:'1.75', padding: '1rem', whiteSpace: 'pre-line'}}>
                {post.content} 
              </Typography>
              <Divider sx={{my:2}}/>
              <Typography component='h2' variant='h6'>
                <strong>
                  {post.comments.length} comments
                </strong>
              </Typography>
              {post.comments.length === 0 ? (
              <Typography variant='subtitle2'>
                There don't appear to be any comments yet. Be the first to give your thoughts on this post.
              </Typography>
              ) : false}
          <Container>
            <Stack spacing={2} sx={{p:2}}>
                { (user?.member_status === 'privileged' || user?.member_status === 'admin') &&
                <Grid container spacing={2} wrap='nowrap'>
                  <Grid item>
                    <Avatar sx={{bgcolor:'#1976d2', width: '30px', height:'30px'}}>{user?.username[0].toUpperCase()}</Avatar>
                  </Grid>
                  <Grid item sx={{flexGrow: '1'}}>
                    <Typography>{user?.username || 'User'} </Typography>
                  </Grid>
                  <Grid item>
                    <FormDialog {...addCommentProps(postId as string, user._id)}/>
                  </Grid>
                </Grid>}
                {post.comments.map((comment)=>
                  <Comment _id={comment._id} content={comment.content} date={comment.date} key={comment._id} post={postId as string} user={comment.user} />
                )}
                <StatusNotification />
              </Stack>
            </Container>  
          </>
          )}
          {!post && !loading && (<Typography align='center' component='h2' variant='h5'>This post is not available right now.</Typography>)}
        </Container>, resetLoadingState)} 
       </>
    )
};


export default Post
