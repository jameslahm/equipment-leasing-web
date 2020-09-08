import React, { useState, useContext } from "react";
import { useLocation, useParams } from "@reach/router";
import { useQuery, useMutation, queryCache } from "react-query";
import { AuthContext, getUser, updateUser, INITIAL_PASSWORD } from "../utils";
import {
  TextField,
  Button,
  makeStyles,
  Container,
  Switch,
  FormControlLabel,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Paper,
  Box,
  IconButton,
  Typography,
} from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import ReactDOM from "react-dom";
import { useSnackbar } from "notistack";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    margin: "auto",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  input: {
    marginTop: theme.spacing(2),
  },
  paper: {
    paddingTop: theme.spacing(2),
    paddingRight: theme.spacing(1),
    paddingBottom:theme.spacing(2)
  },
  text:{
    marginTop:theme.spacing(2)
  }
}));

function UserDetail() {
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("normal");
  // const [avatar,setAvatar]=useState("")
  const [confirmed, setConfirmed] = useState(false);
  const [password, setPassword] = useState(INITIAL_PASSWORD);
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    role: "",
    confirmed: "",
  });

  const params = useParams();
  const location = useLocation();
  const { authState } = useContext(AuthContext);
  const initialStatus = location.state
    ? location.state.status
      ? location.state.status
      : "IDLE"
    : "IDLE";
  const [status, setStatus] = useState(initialStatus);
  const queryKey = ["user", params.id, authState.token];
  const { data = {} } = useQuery(
    queryKey,
    (key, id, token) => getUser(id, token),
    {
      onSuccess: (data) => {
        ReactDOM.unstable_batchedUpdates(() => {
          setUsername(data.username);
          setEmail(data.email);
          setRole(data.role);
          setConfirmed(data.confirmed);
        });
      },
    }
  );
  const [mutate] = useMutation(updateUser, {
    onSuccess: (data) => queryCache.setQueryData(queryKey, data),
  });

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (event) => {
    event.preventDefault();

    errors.username = username ? "" : "Username can't be empty";
    errors.password = password ? "" : "Password can't be empty";
    errors.email = password ? "" : "Password can't be empty";

    if (errors.username || errors.password || errors.email) {
      setErrors({ ...errors });
      return;
    }

    try {
      const data = await mutate({
        data: { username, confirmed, password, email },
      });
      enqueueSnackbar("Update Success", {
        variant: "success",
      });
    } catch (e) {
      enqueueSnackbar("Update Fail", {
        variant: "error",
      });
    }
  };

  return (
    <>
      <Container maxWidth="sm">
        <Paper className={classes.paper}>
          <Box display="flex" justifyContent="flex-end">
            {authState.role === "admin" || authState.id === params.id ? (
              status === "IDLE" ? (
                <IconButton onClick={() => setStatus("EDIT")}>
                  <EditIcon></EditIcon>
                </IconButton>
              ) : (
                <IconButton onClick={() => setStatus("IDLE")}>
                  <VisibilityIcon></VisibilityIcon>
                </IconButton>
              )
            ) : null}
          </Box>
          <Box paddingX={4}>
            {status === "EDIT" ? (
              <form noValidate onSubmit={handleSubmit} className={classes.form}>
                <TextField
                  error={!!errors.username}
                  helperText={errors.username}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                  error={!!errors.password}
                  helperText={errors.password}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                  error={!!errors.email}
                  helperText={errors.email}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="email"
                  label="Email"
                  type="email"
                  id="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FormControl
                  variant="outlined"
                  fullWidth
                  className={classes.input}
                >
                  <InputLabel id="role">Role</InputLabel>
                  <Select
                    labelId="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    label="Role"
                    // disabled
                  >
                    <MenuItem value={"normal"}>Normal</MenuItem>
                    <MenuItem value={"lender"}>Lender</MenuItem>
                    <MenuItem value={"admin"}>Admin</MenuItem>
                  </Select>
                </FormControl>

                <FormControlLabel
                  className={classes.input}
                  control={
                    <Switch
                      value={confirmed}
                      onChange={(e) => setConfirmed(!confirmed)}
                    ></Switch>
                  }
                  label="Confirmed"
                ></FormControlLabel>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Save
                </Button>
              </form>
            ) : (
              <Box>
                <Typography className={classes.text} variant="h6">Username</Typography>
                <Typography variant="subtitle1">{username}</Typography>
                <Typography className={classes.text} variant="h6">Email</Typography>
                <Typography variant="subtitle1">{email}</Typography>
                <Typography className={classes.text} variant="h6">Role</Typography>
                <Typography  variant="subtitle1">{role}</Typography>
                <Typography className={classes.text} variant="h6">Confirmed</Typography>
                <Typography  variant="subtitle1">{confirmed ? "Confirmed":"UnConfirmed"}</Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </>
  );
}

export default UserDetail;
