import React, { useState, useContext } from "react";
import { useLocation, useParams } from "@reach/router";
import { useQuery, useMutation, queryCache } from "react-query";
import {
  AuthContext,
  getUser,
  updateUser,
  INITIAL_PASSWORD,
  canEdit,
} from "utils";
import {
  Button,
  makeStyles,
  Switch,
  FormControlLabel,
  Paper,
  Box,
  IconButton,
  Avatar,
  Typography,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import ReactDOM from "react-dom";
import { useSnackbar } from "notistack";
import { TextField,ConfirmHint } from "components/Widget";
import { capitalize } from "utils";

const useStyles = makeStyles((theme) => ({
  paper: {
    paddingTop: theme.spacing(4),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(2),
    position: "relative",
  },
  avatar: {
    width: theme.spacing(16),
    height: theme.spacing(16),
  },
  text: {
    marginTop: theme.spacing(1),
  },
  success: {
    color: theme.palette.success.main,
  },
  error: {
    color: theme.palette.error.main,
  },
  form: {
    maxWidth: "500px",
    margin: "auto",
  },
  submit: {
    marginTop: theme.spacing(2),
  },
}));

function UserDetail() {
  const classes = useStyles();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [password, setPassword] = useState(INITIAL_PASSWORD);
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
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
  const { data = {}, isLoading } = useQuery(
    queryKey,
    (key, id, token) => getUser(id, token),
    {
      onSuccess: (data) => {
        ReactDOM.unstable_batchedUpdates(() => {
          setUsername(data.username);
          setEmail(data.email);
          setConfirmed(data.confirmed);
        });
      },
      staleTime: Infinity,
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
      await mutate(
        {
          data: {
            username,
            email,
            confirmed,
            ...(password === INITIAL_PASSWORD ? {} : { password: password }),
          },
          id: params.id,
          token: authState.token,
        },
        { throwOnError: true }
      );
      enqueueSnackbar("Update Success", {
        variant: "success",
      });
    } catch (e) {
      enqueueSnackbar("Update Fail", {
        variant: "error",
      });
    }
  };

  if (isLoading) {
    return <Skeleton variant="rect"></Skeleton>;
  }

  return (
    <Paper className={classes.paper}>
      <Box position="absolute" right={4} top={4}>
        {canEdit(authState, { id: params.id }) ? (
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
      {status === "EDIT" ? (
        <form noValidate onSubmit={handleSubmit} className={classes.form}>
          <TextField
            error={!!errors.username}
            helperText={errors.username}
            label="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            error={!!errors.email}
            helperText={errors.email}
            label="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            error={!!errors.password}
            helperText={errors.password}
            label="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControlLabel
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
        <Box display="flex">
          <Avatar
            className={classes.avatar}
            src={data.avatar}
            alt={username}
          ></Avatar>
          <Box
            flexGrow={1}
            ml={8}
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            justifyContent="center"
          >
            <Typography variant="h6">{username}</Typography>
            <Typography className={classes.text} variant="subtitle1">
              {email}
            </Typography>
            <Typography className={classes.text} variant="subtitle2">
              {capitalize(data.role)}
            </Typography>
            <Typography className={classes.text}>
              <ConfirmHint result={data.confirmed}></ConfirmHint>
            </Typography>
          </Box>
        </Box>
      )}
    </Paper>
  );
}

export default UserDetail;
