import React, { useState, useContext } from "react";
import {
  Avatar,
  Button,
  Link,
  Grid,
  Typography,
  makeStyles,
  Container,
} from "@material-ui/core";
import Footer from "./Footer";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { Link as ReachLink, Redirect } from "@reach/router";
import { navigate, useLocation } from "@reach/router";
import { useMutation } from "react-query";
import { login, AuthContext } from "../utils";
import { useSnackbar } from "notistack";
import TextField from "./TextField";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.success.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const classes = useStyles();

  const [errors, setErrors] = useState({ username: "", password: "" });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mutate] = useMutation(login);
  const { authState, setAuthStateAndSave } = useContext(AuthContext);

  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();

  const handleSubmit = async (event) => {
    event.preventDefault();

    errors.username = username ? "" : "Username can't be empty";
    errors.password = password ? "" : "Password can't be empty";

    if (errors.username || errors.password) {
      setErrors({ ...errors });
      return;
    }

    try {
      const data = await mutate({ username: username, password: password },{throwOnError:true});
      setAuthStateAndSave(data);
      enqueueSnackbar("Login Success", {
        variant: "success",
      });
      if (location.state && location.state.from) {
        navigate(location.state.from);
      } else {
        navigate("/dashboard");
      }
    } catch (e) {
      enqueueSnackbar("Login Fail", {
        variant: "error",
      });
    }
  };

  if (authState) {
    return <Redirect to="/dashboard" noThrow></Redirect>;
  }

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            error={!!errors.username}
            helperText={errors.username}
            label="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            error={!!errors.password}
            helperText={errors.password}
            label="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link component={ReachLink} to="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Footer></Footer>
    </Container>
  );
}
