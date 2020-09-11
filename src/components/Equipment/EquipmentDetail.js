import React, { useState, useContext } from "react";
import {
  useLocation,
  useParams,
  Link as ReachLink,
  navigate,
} from "@reach/router";
import { useQuery, useMutation, queryCache } from "react-query";
import {
  AuthContext,
  getEquipment,
  updateEquipment,
  canEdit,
  generateMessage,
} from "utils";
import {
  Button,
  makeStyles,
  Switch,
  FormControlLabel,
  Paper,
  Box,
  IconButton,
  Typography,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Link,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import { useSnackbar } from "notistack";
import { TextField } from "components/Widget";
import ReactDOM from "react-dom";
import RoomIcon from "@material-ui/icons/Room";
import PersonIcon from "@material-ui/icons/Person";
import BuildIcon from "@material-ui/icons/Build";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import IndeterminateCheckBoxIcon from "@material-ui/icons/IndeterminateCheckBox";
import Comment from "./Comment";

const useStyles = makeStyles((theme) => ({
  paper: {
    // paddingTop: theme.spacing(0),
    paddingRight: theme.spacing(2),
    // paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    position: "relative",
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
  media: {
    height: 140,
  },
  hint: {
    marginLeft: theme.spacing(2),
  },
  comment:{
    marginTop:theme.spacing(2),
    marginBottom:theme.spacing(2)
  }
}));

function EquipmentDetail() {
  const classes = useStyles();
  const [name, setName] = useState("");
  const [usage, setUsage] = useState("");
  const [confirmedBack, setConfirmedBack] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    usage: "",
  });

  const params = useParams();
  const location = useLocation();
  const { authState, setAuthStateAndSave } = useContext(AuthContext);
  const initialStatus = location.state
    ? location.state.status
      ? location.state.status
      : "IDLE"
    : "IDLE";
  const [status, setStatus] = useState(initialStatus);
  const queryKey = ["equipment", params.id, authState.token];
  const { data = {}, isLoading, isError } = useQuery(
    queryKey,
    (key, id, token) => getEquipment(id, token),
    {
      retry: false,
      // staleTime: Infinity,
      onSuccess: (data) => {
        ReactDOM.unstable_batchedUpdates(() => {
          if (!name) setName(data.name);
          if (!usage) setUsage(data.usage);
          setConfirmedBack(data.confirmed_back);
        });
      },
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
  const [mutate] = useMutation(updateEquipment, {
    onSuccess: (data) => queryCache.setQueryData(queryKey, data),
  });

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (event) => {
    event.preventDefault();

    errors.name = name ? "" : "Name can't be empty";
    errors.usage = usage ? "" : "Usage can't be empty";

    if (errors.name || errors.usage) {
      setErrors({ ...errors });
      return;
    }

    try {
      await mutate(
        {
          data: { confirmed_back: confirmedBack, name, usage },
          id: params.id,
          token: authState.token,
        },
        { throwOnError: true }
      );
      enqueueSnackbar("Update Success", {
        variant: "success",
      });
    } catch (e) {
      enqueueSnackbar("Return Fail", {
        variant: "error",
      });
    }
  };

  const handleReturnBack = async () => {
    try {
      await mutate(
        {
          data: { name, confirmed_back: confirmedBack, usage },
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

  if (isLoading || isError) {
    return <Skeleton variant="rect" height="400px"></Skeleton>;
  }

  return (
    <>
      <Paper className={classes.paper}>
        <Box position="absolute" right={4} top={4}>
          {canEdit(authState, { id: data.owner.id }) ? (
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
              error={!!errors.name}
              helperText={errors.name}
              label="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              multiline
              rows={5}
              rowsMax={20}
              error={!!errors.usage}
              helperText={errors.usage}
              label="usage"
              value={usage}
              onChange={(e) => setUsage(e.target.value)}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={confirmedBack}
                  onChange={() => setConfirmedBack(!confirmedBack)}
                ></Switch>
              }
              label="ConfirmedBack"
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
          <Box ml={0} maxWidth="500px">
            <CardContent>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <BuildIcon></BuildIcon>
                  </ListItemIcon>
                  <ListItemText primary={data.name} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon></PersonIcon>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Link
                        component={ReachLink}
                        to={`/users/${data.owner.id}`}
                      >
                        {data.owner.username}
                      </Link>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <RoomIcon></RoomIcon>
                  </ListItemIcon>
                  <ListItemText
                    primary={data.owner.lab_name}
                    secondary={data.owner.lab_location}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LibraryBooksIcon></LibraryBooksIcon>
                  </ListItemIcon>
                  <ListItemText primary={data.usage} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <IndeterminateCheckBoxIcon></IndeterminateCheckBoxIcon>
                  </ListItemIcon>
                  <ListItemText primary={data.status.toUpperCase()} />
                </ListItem>
              </List>
              {authState.role === "normal" &&
              !data.current_application &&
              data.status === "idle" ? (
                <Button
                  component={ReachLink}
                  to={`/applications/borrow/create/${data.id}`}
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Apply
                </Button>
              ) : null}
              {data.current_application &&
              authState.id === data.current_application.candidate_id ? (
                <Button
                  fullWidth
                  onClick={handleReturnBack}
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Return Back
                </Button>
              ) : null}
              {authState.id === data.owner.id && data.status === "refused" ? (
                <Button
                  fullWidth
                  onClick={() => {
                    navigate(`/applications/puton/create/${data.id}`);
                  }}
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Apply PutOn Again
                </Button>
              ) : null}
              <Typography
                className={classes.hint}
                variant="body2"
                component="p"
                color="secondary"
              >
                {!data.current_application &&
                !confirmedBack &&
                data.owner.id === authState.id
                  ? "Please confirm the equipment has been returned back"
                  : null}
              </Typography>
            </CardContent>
          </Box>
        )}
      </Paper>
      <Typography className={classes.comment} variant="h5">Comments</Typography>
      <Comment></Comment>
    </>
  );
}

export default EquipmentDetail;
