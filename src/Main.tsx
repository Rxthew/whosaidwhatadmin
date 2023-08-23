import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CircularProgress  from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Comment from '@mui/icons-material/Comment'
import CssBaseline  from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Link as MainLink } from 'react-router-dom';
import { useIndexData, useLoadingState } from './helpers/hooks';
import { CommentsType } from './helpers/types';
import { regulariseDate } from './helpers/utils';



interface postPreviewProps {
  post: {
    _id: string,
    date: string,
    comments: CommentsType,
    content: string,
    published_status: boolean,
    title: string
  };
}


const PostPreview = function PostPreview(props: postPreviewProps) {
  const { post } = props;
  
  const commentsCount = post.comments.length;
  const date = regulariseDate(post.date);

  const truncatePostContent = function truncatePostContent(content:string){
    return content.substring(0,350) + '...'
  }

  return (
    <Grid item xs={12} md={6}>
      <CardActionArea component={MainLink} to={`/post/${post._id}`}>
        <Card sx={{ display: 'flex' }}>
          <CardContent sx={{ flex: 1 }}>
            <Typography component="h2" variant="h5">
              {post.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {date}
            </Typography>
            <Typography variant= 'subtitle1' color="text.secondary">
              {post.published_status ? 'Published' : 'Unpublished'}
            </Typography>
            <Typography variant="subtitle1" paragraph>
              {truncatePostContent(post.content)}
            </Typography>
            <Grid sx={{display: 'flex'}} justifyContent="space-between">
                <Typography variant="subtitle1" color="primary">
                    Continue reading...
                </Typography>
              <Badge badgeContent={commentsCount} color="primary">
                <Comment color="primary" titleAccess="CommentsIcon" fontSize='large' />
              </Badge>
            </Grid>    
          </CardContent>
        </Card>
      </CardActionArea>
    </Grid>
  );
}


const Main = function(){

   const { posts, user } = useIndexData()
   const { loading } = useLoadingState();
   

   const postsNotLoaded = !posts  && !loading;
   const postsAreEmpty = posts && posts.length === 0 && !loading;
   const postsAreLoaded = posts && posts.length > 0 && !loading;
   const userAdmin = user?.member_status === 'admin';
   const userNotValid = (!user || !userAdmin) && !loading;
   
   
    return (
        <>
        <CssBaseline />
        <Container maxWidth="lg" sx={{py:4}}>
          <main>
            { loading && (
              <Box sx={{display: 'flex', justifyContent: 'center'}}>
                <CircularProgress size={60}/>
              </Box>
            )}
            {
              userNotValid ?
               <>
                {
                  user || (
                    <Typography  align='center' component='h2' variant='h5'>
                      This is the administration frontend for WhoSaidWhat.
                      Please <Link component={MainLink} to={'/login'}>
                           log in
                       </Link> or 
                      <Link component={MainLink} to={'/signup'}
                      > sign up
                      </Link> to gain access.
                    </Typography>
                    ) 
                }
                {  
                  !user || userAdmin || (
                  <Typography  align='center' component='h2' variant='h5'>
                    It looks like you do not have administrative privileges to access this page.
                    You can <Link component={MainLink} to={`user/${user?._id}`}>
                        update your membership
                      </Link> to admin to gain access.
                  </Typography>
                  )     
                }
              </>
              :
              <> 
                { postsAreLoaded && (
                  <Grid container spacing={4}>
                    {posts.map(
                      function convertToPreview(post){
                        return <PostPreview key={post.title} post={post} />
                    })}
                  </Grid>
              )}
              { postsAreEmpty && (
              <Typography  align='center' component='h2' variant='h5'>You have not written any posts yet.</Typography>
              )}
              { postsNotLoaded && (
              <Typography  align='center' component='h2' variant='h5'> Posts data has not been retrieved from API.</Typography>
              )}
            </>
            }         
            
          </main>
        </Container>
        
        </>
    )

}

export default Main