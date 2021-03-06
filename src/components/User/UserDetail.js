import React, { useState, useContext, useEffect } from "react";
import { useLocation, useParams, navigate } from "@reach/router";
import { useQuery, useMutation, queryCache } from "react-query";
import {
  AuthContext,
  getUser,
  updateUser,
  INITIAL_PASSWORD,
  canEdit,
  generateMessage,
  ChatContext,
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
import { TextField, ConfirmHint } from "components/Widget";
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
  logout: {
    marginTop: theme.spacing(4),
    marginLeft: theme.spacing(2),
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

  useEffect(() => {
    if (username) {
      setUsername("");
    }
    if (password) {
      setPassword(INITIAL_PASSWORD);
    }
    if (email) {
      setEmail("");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const { enqueueSnackbar } = useSnackbar();

  const location = useLocation();
  const { authState, setAuthStateAndSave } = useContext(AuthContext);
  const initialStatus = location.state
    ? location.state.status
      ? location.state.status
      : "IDLE"
    : "IDLE";
  const [status, setStatus] = useState(initialStatus);
  const queryKey = [
    "user",
    params.id,
    authState.token || authState.confirm_token,
  ];
  const { data = {}, isLoading, isError } = useQuery(
    queryKey,
    (key, id, token) => getUser(id, token),
    {
      onSuccess: (data) => {
        ReactDOM.unstable_batchedUpdates(() => {
          if (!username) setUsername(data.username);
          if (!email) setEmail(data.email);
          setConfirmed(data.confirmed);
        });
      },
      // staleTime: Infinity,
      retry: false,
      onError: (e) => {
        enqueueSnackbar(generateMessage(e, "/edit"), {
          variant: "error",
        });

        if (e.status === 401) {
          setAuthStateAndSave(null);
          navigate("/login");
        }
        if (e.status === 404) {
          navigate("/");
        }
      },
    }
  );
  const [mutate] = useMutation(updateUser, {
    onSuccess: (data) => queryCache.setQueryData(queryKey, data),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    errors.username = username ? "" : "Username can't be empty";
    errors.password = password ? "" : "Password can't be empty";
    // eslint-disable-next-line no-useless-escape
    const pattern = /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/;

    errors.email = pattern.test(email) ? "" : "Email is not valid";

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
          token: authState.token || authState.confirm_token,
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

  const { messages, setMessagesAndSave } = useContext(ChatContext);

  const handleLogOut = () => {
    setAuthStateAndSave(null);
    enqueueSnackbar("LogOut Success", {
      variant: "success",
    });
    navigate(`/login`);
  };

  if (isLoading || isError) {
    return <Skeleton variant="rect" height="400px"></Skeleton>;
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
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControlLabel
            control={
              <Switch
                value={confirmed}
                onChange={(e) => setConfirmed(!confirmed)}
                checked={confirmed}
                disabled={true}
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
          <Box display="flex">
            <Avatar
              className={classes.avatar}
              src={data.avatar}
              alt={data.username}
            ></Avatar>
            <Box
              flexGrow={1}
              ml={8}
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              justifyContent="center"
            >
              <Typography variant="h6">{data.username}</Typography>
              <Typography className={classes.text} variant="subtitle1">
                {data.email}
              </Typography>
              <Typography className={classes.text} variant="subtitle2">
                {capitalize(data.role)}
              </Typography>
              <Typography className={classes.text}>
                <ConfirmHint result={data.confirmed}></ConfirmHint>
              </Typography>
            </Box>
          </Box>

          {authState.id === parseInt(params.id) ? (
            <Button
              variant="contained"
              className={classes.logout}
              color="primary"
              onClick={handleLogOut}
            >
              LogOut
            </Button>
          ) : (
            <Button
              variant="contained"
              className={classes.logout}
              color="primary"
              onClick={() => {
                if (!(data.id in messages)) {
                  messages[data.id] = {
                    username: data.username,
                    avatar: data.avatar,
                    messages: [],
                    isRead: true,
                    total: 0,
                  };
                }
                setMessagesAndSave(messages);
                navigate(`/chat/${params.id}`);
              }}
            >
              Chat
            </Button>
          )}
        </Box>
      )}
    </Paper>
  );
}

export default UserDetail;
