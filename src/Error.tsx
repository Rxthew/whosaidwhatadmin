import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';


const Error = function Error(){
    return (
        <Box sx={{display:'flex', flexDirection: 'column', gap:'10px'}}>
            <CssBaseline />
            <AppBar position='static' sx={{padding: '1rem'}}>
                <Typography align='left' component='h1' variant='h4'>Something went wrong :(</Typography>
            </AppBar>
            <Typography align='center' component='h2' variant='h5'>Please wait for a few minutes and try again.</Typography>
        </Box>
    )

}

export default Error