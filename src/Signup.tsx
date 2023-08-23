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

 
const Signup = function Signup(){

  const [errors,setErrors] = useErrorStates(['first_name', 'last_name', 'username', 'password', 'privilege_code', 'admin_code']);
  const { resetIndexData } = useIndexData();

  const signUpFetcher = async function(data:string){
    const response = await fetch("http://localhost:3000/signup", { //Update url when ready.
      body: data, 
      credentials: 'include',
      headers: {"Accept": "application/json", "Content-Type": "application/json", "Origin": `${window.location.origin}`},
      method: 'POST', 
      mode: 'cors',
      redirect: 'follow', 
      referrer: window.location.href
    })
    const errorStatus = await settleErrors(response,setErrors)
    return errorStatus && [resetIndexData, redirectToOrigin].map((action)=> action());
    }
      
    const handleSubmit = async function handleSubmit(event: React.FormEvent<HTMLFormElement>){
        event.preventDefault();
        const rawData = new FormData(event.currentTarget);
        const data = JSON.stringify(Object.fromEntries(rawData.entries()));
        await signUpFetcher(data)
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
                Sign up
              </Typography>
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              {errors.general.error ? (
                  <Typography component="h2" variant="h6" sx={{color: "red"}}>
                    {errors.general.msg}
                  </Typography>
                )
                : false}
              <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      {errors.first_name.error ? (
                        <TextField
                        error
                        autoComplete="given-name"
                        name="first_name"
                        required
                        fullWidth
                        id="first_name"
                        label="First Name"
                        autoFocus
                        helperText={errors.first_name.msg}
                        />
                      ):(
                        <TextField
                        autoComplete="given-name"
                        name="first_name"
                        required
                        fullWidth
                        id="first_name"
                        label="First Name"
                        autoFocus                       
                        />
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {errors.last_name.error ? (
                        <TextField
                        error
                        required
                        fullWidth
                        id="last_name"
                        label="Last Name"
                        name="last_name"
                        autoComplete="family-name"
                        helperText={errors.last_name.msg}
                        />
                      ):(
                        <TextField
                        required
                        fullWidth
                        id="last_name"
                        label="Last Name"
                        name="last_name"
                        autoComplete="family-name"
                        />
                      )}
                    </Grid>
                    <Grid item xs={12}>
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
                    </Grid>
                    <Grid item xs={12}>
                    {errors.password.error ? (
                       <TextField
                        error
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        helperText={errors.password.msg}
                   />
                    ) : 
                    (
                       <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        />
                    )}
                       
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {errors.privilege_code.error ? (
                        <TextField
                        error
                        margin="normal"
                        fullWidth
                        label="Privilege Code"
                        name="privilege_code"
                        type="password"
                        id="privilege_code"
                        helperText={errors.privilege_code.msg}
                    />

                      ) : (
                        <TextField
                        margin="normal"
                        fullWidth
                        label="Privilege Code"
                        name="privilege_code"
                        type="password"
                        id="privilege_code"
                        />
                      )}
                        
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {errors.admin_code.error ? (
                        <TextField
                        error
                        margin="normal"
                        fullWidth
                        label="Admin Code"
                        name="admin_code"
                        type="password"
                        id="admin_code"
                        helperText={errors.admin_code.msg}
                      />
                      ) : (
                        <TextField
                        margin="normal"
                        fullWidth
                        label="Admin Code"
                        name="admin_code"
                        type="password"
                        id="admin_code"
                          />
                      )}
                        
                    </Grid>    
                </Grid>             
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign Up
                </Button>
                <Grid container>
                  <Grid item>
                  <Link component={FormLink} to={'/login'}> 
                      <Typography>Already have an account? Sign In</Typography>
                  </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Container>
      );
};

export default Signup
