
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Link as FormLink } from 'react-router-dom';
import { useErrorStates, useIndexData } from './helpers/hooks';
import {  redirectToOrigin, settleErrors } from './helpers/services';
import { handleStatus401 } from './helpers/utils';

 const Login = function Login(){

   const [errors,setErrors] = useErrorStates(['username', 'password']);
   const { resetIndexData } = useIndexData();

    const loginFetcher = async function(data:string){
      const response = await fetch("http://localhost:3000/login", { //Update url when ready.
        body: data,
        credentials: 'include',
        headers: {"Accept": "application/json", "Content-Type": "application/json", "Origin": `${window.location.origin}`},
        method: 'POST', 
        mode: 'cors',
        redirect: 'follow', 
        referrer: window.location.href
      })
      const updatedResponse = handleStatus401(response);
      const errorStatus = await settleErrors(updatedResponse,setErrors)
      return errorStatus && [resetIndexData, redirectToOrigin].map((action)=> action());
    }

    const handleSubmit = async function handleSubmit(event: React.FormEvent<HTMLFormElement>){
        event.preventDefault();
        const rawData = new FormData(event.currentTarget);
        const data = JSON.stringify(Object.fromEntries(rawData.entries()));
        await loginFetcher(data);
    };

      return (
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Log In
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                {errors.general.error ? (
                  <Typography component="h2" variant="h6" sx={{color: "red"}}>
                    {errors.general.msg}
                  </Typography>
                )
                : false}
                {errors.username.error ? (
                  <TextField
                  error
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  helperText={errors.username.msg}
                  />
                )
                  :
                  (
                  <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                   />
                  )

                }
                {
                  errors.password.error ? (
                    <TextField
                      error
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="password"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                      helperText={errors.password.msg}
                    />
                  )
                  
                  : (
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="password"
                      label="password"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                     />

                  )
                }
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Login to your account
                </Button>
                <Grid container>
                  <Grid item>
                  <Link component={FormLink} to={'/signup'}> 
                      <Typography>Don't have an account? Sign up.</Typography>
                  </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>
      );
};

export default Login
