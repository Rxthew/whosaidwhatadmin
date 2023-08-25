import Alert from '@mui/material/Alert';
import Button from "@mui/material/Button";
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from '@mui/material/FormControlLabel'
import Snackbar from '@mui/material/Snackbar';
import TextField  from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from 'react'; 
import { useParams } from "react-router-dom";
import { useErrorStates, useIndexData, useNotifications, useNotificationsDispatch, useResetLoadingState } from "./hooks";
import {  FormDialogProps, NotificationReducerInterface } from "./types";
import { extractPostById, restoreOriginalErrorState  } from "./utils";



const PublishedStatusCheckbox = function(){
    const { postId } = useParams();
    const { posts } = useIndexData();
    const post = postId && posts && posts.length > 0 ? extractPostById(postId, posts) : null;
    const publishedStatus = post?.published_status || false
  
  
    const [published, setPublished] = React.useState<boolean>(publishedStatus);
  
    const handleChange = function(event: React.ChangeEvent<HTMLInputElement>){
        setPublished(event.target.checked)
    };
  
    return(
      <FormControlLabel 
      control= {<Checkbox defaultChecked={published} onChange={handleChange} name="published_status" value={published} />}
      label='Publish'
      sx={{color: 'grey'}}
      />
    )
  }
  
  export const FormDialog = function(props: FormDialogProps){
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
                  {props.titleLabel && (
                   <TextField 
                  autoFocus
                  defaultValue={props.title || ""}
                  fullWidth
                  id="title"
                  margin="dense"
                  name="title"
                  label={props.titleLabel}
                  size="medium"
                  type="text"
                  variant="standard"
                  sx={{whiteSpace:"pre-line"}} 
                  />
                  )} 
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
                  {props.titleLabel &&
                  <PublishedStatusCheckbox />
                  }
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
  
  export const StatusNotification = function(){
  
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