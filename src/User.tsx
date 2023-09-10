import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useErrorStates, useIndexData } from "./helpers/hooks";
import { redirectToOrigin, settleErrors } from "./helpers/services";
import { restoreOriginalErrorState } from "./helpers/utils";

const DeleteUserDialog = function () {
  const [open, setOpen] = React.useState(false);
  const [errors, setErrors] = useErrorStates(["id"]);
  const { resetIndexData, user } = useIndexData();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    restoreOriginalErrorState(setErrors);
  };

  const deleteUserFetcher = async function () {
    const userId = user?._id;
    const response = await fetch(`https://wswapi.onrender.com/user/${userId}`, {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Origin: `${window.location.origin}`,
      },
      method: "DELETE",
      mode: "cors",
      redirect: "follow",
      referrer: window.location.href,
    }).catch((err: Error) => {
      throw err;
    });
    const errorStatus = await settleErrors(response, setErrors).catch(
      (err: Error) => {
        throw err;
      }
    );
    return (
      errorStatus &&
      [resetIndexData, redirectToOrigin].map((action) => action())
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await deleteUserFetcher().catch((err: Error) => {
      console.error(err);
    });
  };

  return (
    <div>
      <Button
        type="button"
        fullWidth
        variant="contained"
        sx={{ backgroundColor: "red", mt: 3, mb: 2 }}
        onClick={handleClickOpen}
      >
        Delete Your Profile
      </Button>
      <Dialog fullWidth open={open} onClose={handleClose}>
        {errors.general.error && (
          <Typography component="h2" variant="h6" sx={{ color: "red", p: 2 }}>
            Error: {errors.general.msg}
          </Typography>
        )}
        {errors.id.error && (
          <Typography component="h2" variant="h6" sx={{ color: "red", p: 2 }}>
            Error: {errors.id.msg}
          </Typography>
        )}
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Be absolutely sure you want to delete this profile. Once deleted, it
            shall be impossible to retrieve.
          </DialogContentText>
          <form id="dialogForm" onSubmit={handleSubmit}></form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="dialogForm">
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const User = function User() {
  const [errors, setErrors] = useErrorStates([
    "first_name",
    "last_name",
    "username",
    "current_password",
    "new_password",
    "privilege_code",
    "admin_code",
  ]);
  const { resetIndexData, user } = useIndexData();
  const [regularMember, setRegularMember] = React.useState<boolean>(false);

  const handleChange = function (event: React.ChangeEvent<HTMLInputElement>) {
    setRegularMember(event.target.checked);
  };

  const updateUserFetcher = async function (data: string) {
    const userId = user?._id;
    const response = await fetch(`https://wswapi.onrender.com/user/${userId}`, {
      body: data,
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Origin: `${window.location.origin}`,
      },
      method: "PUT",
      mode: "cors",
      redirect: "follow",
      referrer: window.location.href,
    });
    const errorStatus = await settleErrors(response, setErrors);
    return (
      errorStatus &&
      [resetIndexData, redirectToOrigin].map((action) => action())
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const rawData = new FormData(event.currentTarget);
    const data = JSON.stringify(Object.fromEntries(rawData.entries()));
    await updateUserFetcher(data);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Update user details
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {errors.general.error ? (
            <Typography component="h2" variant="h6" sx={{ color: "red" }}>
              {errors.general.msg}
            </Typography>
          ) : (
            false
          )}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              {errors.first_name.error ? (
                <TextField
                  error
                  autoComplete="given-name"
                  name="first_name"
                  defaultValue={user?.first_name}
                  fullWidth
                  id="first_name"
                  label="First Name"
                  autoFocus
                  helperText={errors.first_name.msg}
                />
              ) : (
                <TextField
                  autoComplete="given-name"
                  name="first_name"
                  defaultValue={user?.first_name}
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
                  fullWidth
                  id="last_name"
                  label="Last Name"
                  name="last_name"
                  defaultValue={user?.last_name}
                  autoComplete="family-name"
                  helperText={errors.last_name.msg}
                />
              ) : (
                <TextField
                  fullWidth
                  id="last_name"
                  label="Last Name"
                  name="last_name"
                  defaultValue={user?.last_name}
                  autoComplete="family-name"
                />
              )}
            </Grid>
            <Grid item xs={12}>
              {errors.username.error ? (
                <TextField
                  error
                  margin="normal"
                  fullWidth
                  id="username"
                  label="username"
                  name="username"
                  defaultValue={user?.username}
                  autoComplete="username"
                  autoFocus
                  helperText={errors.username.msg}
                />
              ) : (
                <TextField
                  margin="normal"
                  fullWidth
                  id="username"
                  label="username"
                  name="username"
                  defaultValue={user?.username}
                  autoComplete="username"
                  autoFocus
                />
              )}
            </Grid>
            <Grid item xs={12}>
              {errors.current_password.error ? (
                <TextField
                  error
                  margin="normal"
                  fullWidth
                  type="password"
                  id="current_password"
                  label="current_password"
                  name="current_password"
                  autoComplete="current-password"
                  autoFocus
                  helperText={errors.current_password.msg}
                />
              ) : (
                <TextField
                  margin="normal"
                  fullWidth
                  name="current_password"
                  label="current password"
                  type="password"
                  id="current_password"
                  autoComplete="current-password"
                />
              )}
            </Grid>
            <Grid item xs={12}>
              {errors.new_password.error ? (
                <TextField
                  error
                  margin="normal"
                  fullWidth
                  type="password"
                  id="new_password"
                  label="new_password"
                  name="new_password"
                  autoComplete="new-password"
                  autoFocus
                  helperText={errors.new_password.msg}
                />
              ) : (
                <TextField
                  margin="normal"
                  fullWidth
                  name="new_password"
                  label="new password"
                  type="password"
                  id="new_password"
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
            <Grid item>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={handleChange}
                    name="regular"
                    value={regularMember}
                  />
                }
                label="Choose Regular Membership"
                sx={{ color: "grey" }}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Update your details
          </Button>
        </Box>
        <DeleteUserDialog />
      </Box>
    </Container>
  );
};

export default User;
