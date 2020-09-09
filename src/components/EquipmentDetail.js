import React, { useState, useContext } from "react";
import { useLocation, useParams } from "@reach/router";
import { useQuery, useMutation, queryCache } from "react-query";
import { AuthContext, getEquipment, updateEquipment, canEdit } from "../utils";
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
  CardMedia,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import { useSnackbar } from "notistack";
import TextField from "./TextField";

const useStyles = makeStyles((theme) => ({
  paper: {
    paddingTop: theme.spacing(4),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(4),
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
  const { authState } = useContext(AuthContext);
  const initialStatus = location.state
    ? location.state.status
      ? location.state.status
      : "IDLE"
    : "IDLE";
  const [status, setStatus] = useState(initialStatus);
  const queryKey = ["equipment", params.id, authState.token];
  const { data = {}, isLoading } = useQuery(
    queryKey,
    (key, id, token) => getEquipment(id, token),
    {
      onSuccess: (data) => {
        ReactDOM.unstable_batchedUpdates(() => {
          setName(data.name);
          setUsage(data.usage);
          setConfirmedBack(data.confirmed_back);
        });
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
      await mutate({
        data: { name, confirmed_back: confirmedBack, usage },
        id: params.id,
        token: authState.token,
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

  if (isLoading) {
    return <Skeleton variant="rect"></Skeleton>;
  }

  return (
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
            error={!!errors.usage}
            helperText={errors.usage}
            label="usage"
            value={usage}
            onChange={(e) => setUsage(e.target.value)}
          />

          <FormControlLabel
            className={classes.input}
            control={
              <Switch
                value={confirmedBack}
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
        <Box ml={2} maxWidth="500px">
          <CardMedia
            className={classes.media}
            image="https://source.unsplash.com/random"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {name}
            </Typography>
            {/* <Link component={ReachLink}>

            </Link> */}
            <Typography variant="subtitle1" component="p">
              {usage}
            </Typography>
            <Typography variant="body2"  component="p" color="secondary">
              {
                !data.application_id && !confirmedBack ? "Please confirm the equipment has been returned back":null
              }
            </Typography>
          </CardContent>
        </Box>
      )}
    </Paper>
  );
}

export default EquipmentDetail;
