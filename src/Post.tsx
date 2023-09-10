import Avatar from '@mui/material/Avatar'
import Button from "@mui/material/Button";
import Box from '@mui/material/Box';
import CircularProgress  from '@mui/material/CircularProgress';
import Container from '@mui/material/Container'
import Divider from "@mui/material/Divider";
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import Typography from "@mui/material/Typography";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import * as React from 'react'; 
import { useParams } from "react-router-dom";
import { FormDialog, StatusNotification } from './helpers/components';
import { PostContextProvider } from './helpers/contexts';
import { useIndexData, useLoadingState } from "./helpers/hooks";
import { CommentInterface } from "./helpers/types";
import { produceCommentFormProps, producePostFormProps } from './helpers/services';
import { extractPostById, regulariseDate  } from "./helpers/utils";


  const {
         addCommentProps, 
         deleteCommentProps,
         editCommentProps
        } = produceCommentFormProps(); 
        
  const {
        deletePostProps,
        editPostProps
        } = producePostFormProps();
 

const Comment = function(props: CommentInterface){ 

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const { user } = useIndexData();
  const date = regulariseDate(props.date);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
  <Box sx={{display: 'flex'}}>
    {user && (
    <Paper sx={{p:2, flexGrow: '1'}} variant='outlined'>
      <Grid container spacing={6} wrap='nowrap'>
        <Grid item> 
          <Typography variant='overline'>{props.user?.username}:</Typography>      
        </Grid>
        <Grid item>
          <Typography variant='subtitle1' color='text.secondary'>Last Updated: {date}</Typography>
        </Grid>
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
              <FormDialog {...editCommentProps({content: props.content, id: props._id, post: props.post, userId: props.user._id})} />
              <FormDialog {...deleteCommentProps(props._id, props.user._id)} />  
            </Stack>
          </Popover>
        
      </Grid>
      </Grid>
      <Typography gutterBottom={true} paragraph={true} sx={{whiteSpace:"pre-line"}} >
            {props.content}
      </Typography>  
    </Paper>
    )}
  </Box>   
  );   
}; 

const Post = function Post(){   
    const { postId } = useParams();
    const { user, posts } = useIndexData();
    const { loading, resetLoadingState } = useLoadingState(posts);
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const post = postId && posts && posts.length > 0 ? extractPostById(postId, posts) : null;
    const date = post && post.date ? regulariseDate(post.date) : ''
    const userAdmin = user?.member_status === 'admin';

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    const resetAnchorAndLoad = function(){
      [handleClose, resetLoadingState].map(action => action())
   };
  
    const open = Boolean(anchorEl);
  
    return (
       <>
       {PostContextProvider(
       <Container sx={{py:4}}>
          {loading && (
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                <CircularProgress size={60}/>
            </Box>)}
          {post && !loading && user && userAdmin && (
              <>
              <Typography component='h1' variant='h4'>{post.title}</Typography>
              <Grid container spacing={6} wrap='nowrap'>
              <Grid item> 
                <Typography variant='subtitle1' color="text.secondary">Written by: {post.user?.username}:</Typography>      
              </Grid>              
                <Grid item>
                  <Typography variant='subtitle1' color="text.secondary">Last Updated: {date}</Typography>
                </Grid>
                <Grid item>
                  <Typography variant= 'subtitle1' color="text.secondary">{post.published_status ? 'Published' : 'Unpublished'}</Typography>                  
                </Grid>
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
                      <FormDialog {...editPostProps({id: post._id, content: post.content, title: post.title, userId: post.user._id})} />
                      <FormDialog {...deletePostProps(post._id, post.user._id)} />  
                    </Stack>
                  </Popover>
               </Grid>                
              </Grid>
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
                </Grid>
                {post.comments.map((comment)=>
                  <Comment _id={comment._id} content={comment.content} date={comment.date} key={comment._id} post={postId as string} user={comment.user} />
                )}
                <StatusNotification />
              </Stack>
            </Container>  
          </>
          )}
          {!post && !loading && !user && !userAdmin && (<Typography align='center' component='h2' variant='h5'>This post is not available right now.</Typography>)}
        </Container>, resetAnchorAndLoad)} 
       </>
    )
};


export default Post
