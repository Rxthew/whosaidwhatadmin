import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useState } from 'react'
import { Link as HeaderLink } from 'react-router-dom';
import { redirectToOrigin } from './helpers/services';
import { UserInterface } from './helpers/types';


interface HeaderProps {
    reset: () => void
    user?: UserInterface,

}

export default function Header(props:HeaderProps) {
    const {username} = props.user || {username: null};
    const [mobileOpen, setMobileOpen] = useState(false);
    const resetIndexData  = props.reset

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };


  const handleLogout= async function(){
    const response = await fetch("http://localhost:3000/logout", { //Update url when ready.
        headers: {"Accept": "application/json", "Origin": `${window.location.origin}`},
        credentials: 'include',
        method: 'POST', 
        mode: 'cors',
      }).catch(function(err:Error){console.error(err); return {ok: false, statusText: 'Please refer to error logs.'}})
    return response.ok ?  [resetIndexData, redirectToOrigin].map((action)=> action()) : console.error(response.statusText)
};

   
  const drawerWidth = 240;

  const navItems = username ? ["Edit profile", "Log out"] : ["Sign up", "Log in"]

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
         Actions
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

    return (
    <>
      <Box sx={{display: 'flex'}}>
        <CssBaseline />
        <AppBar component="nav" position="static">
          <Toolbar sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Link component={HeaderLink} to={'/'} color="inherit"  sx={{flexGrow: 1, textDecoration: "none" }}> 
              <Typography
                component="h1"
                variant="h2"
                color="inherit"
                align="left"
                noWrap
                sx={{display: {xs: 'none', sm:'none', md: 'block'}}}
              >
                Who Said What
              </Typography>
            </Link>
            <Link component={HeaderLink} to={'/'} color="inherit"  sx={{flexGrow: 1, textDecoration: "none" }}>
              <Typography
                component="h1"
                variant="h3"
                color="inherit"
                align="left"
                noWrap
                sx={{display: {xs: 'block', md: 'none'} }}
              >
                WSW
              </Typography>
            </Link>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              {username ? (
              <>   
                <Typography>
                  Welcome {username}
                </Typography>
                <Link component={HeaderLink} to={`/user/${props.user?._id}`} color="inherit">
                  <Button color="inherit" >
                      Edit profile
                  </Button>
                </Link>
                <Button color="inherit" onClick={handleLogout}>
                    Log out
                </Button>
              </> )
              : 
              ( <>
                <Link component={HeaderLink} to={'/signup'} color="inherit">
                  <Button color="inherit" > 
                    Sign up
                  </Button>
                </Link>
                <Link component={HeaderLink} to={'/login'} color="inherit">
                  <Button color="inherit" >
                    Log in
                  </Button>
                </Link>
              </> )
              }
            </Box>
          </Toolbar>          
        </AppBar>
        <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, 
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      </Box>

    </>
  );
}