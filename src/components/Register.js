import React, { useState, useContext } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Footer from "./Footer";
import { Link as ReachLink,useLocation,navigate } from "@reach/router";
import { AuthContext, register } from "../utils";
import { useMutation } from "react-query";
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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp() {
  const classes = useStyles();

  const [errors, setErrors] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mutate] = useMutation(register);
  const { setAuthStateAndSave } = useContext(AuthContext);

  const { enqueueSnackbar } = useSnackbar();

  const location=useLocation()

  const handleSubmit = async (event) => {
    event.preventDefault();

    errors.email = email ? "" : "Email can't be empty";
    errors.username = username ? "" : "Username can't be empty";
    errors.password = password ? "" : "Password can't be empty";

    if (errors.email || errors.username || errors.password) {
      setErrors({ ...errors });
      return;
    }

    try {
      const data = await mutate({
        username: username,
        email: email,
        password: password,
      },{throwOnError:true});
      setAuthStateAndSave(data);
      enqueueSnackbar("Register Success", {
        variant: "success",
      });
      if(location.state && location.state.from){
        navigate(location.state.from)
      }
      else{
        navigate('/dashboard')
      }
    } catch (e) {
      enqueueSnackbar("Register Error", {
        variant: "error",
      });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            error={!!errors.email}
            helperText={errors.email}
            label="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            error={!!errors.username}
            helperText={errors.username}
            label="username"
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
            Sign Up
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link component={ReachLink} to="/login" variant="body2">
                {"Already has an account? Sign In"}
              </Link>
            </Grid>
          </Grid>
        </form>
        <Footer></Footer>
      </div>
    </Container>
  );
}
