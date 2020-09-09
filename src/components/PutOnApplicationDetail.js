import React, { useState, useContext } from "react";
import { useLocation, useParams } from "@reach/router";
import { useQuery, useMutation, queryCache } from "react-query";
import {
  AuthContext,
  getPutOnApplication,
  updatePutOnApplication
} from "../utils";
import {
  Button,
  makeStyles,
  CardContent,
  CardActions,
  Paper,
  Box,
  IconButton,
  Typography,
} from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import ReactDOM from "react-dom";
import { useSnackbar } from "notistack";
import { Skeleton } from "@material-ui/lab";
import StatusHint from "./StatusHint";

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

function LenderApplicationDetail() {
  const classes = useStyles();
  const [applicationStatus, setApplicationStatus] = useState("unreviewed");
  const params = useParams();
  const location = useLocation();
  const { authState } = useContext(AuthContext);
  const initialStatus = location.state
    ? location.state.status
      ? location.state.status
      : "IDLE"
    : "IDLE";
  const [status, setStatus] = useState(initialStatus);
  const queryKey = ["lender", params.id, authState.token];
  const { data = {}, isLoading } = useQuery(
    queryKey,
    (key, id, token) => getPutOnApplication(id, token),
    {
      onSuccess: (data) => {
        ReactDOM.unstable_batchedUpdates(() => {
          setApplicationStatus(data.status);
        });
      },
    }
  );
  const [mutate] = useMutation(updatePutOnApplication, {
    onSuccess: (data) => queryCache.setQueryData(queryKey, data),
  });

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await mutate({
        data: { status: applicationStatus },
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
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {data.candidate.username}
        </Typography>
        <Typography variant="body1" color="textSecondary" component="p">
          {data.usage}
        </Typography>
        <Typography variant="body1" color="textSecondary" component="p">
        </Typography>
      </CardContent>
      {status === "EDIT" ? (
        <CardActions>
          <Button size="small" color="primary">
            Agree
          </Button>
          <Button size="small" color="primary">
            Reject
          </Button>
        </CardActions>
      ) : null}
    </Paper>
  );
}

export default LenderApplicationDetail;
