import React, { useState, useContext } from "react";
import { useLocation, useParams } from "@reach/router";
import { useQuery, useMutation, queryCache } from "react-query";
import {
  AuthContext,
  updatePutonApplication,
  getPutonApplication,
} from "../utils";
import {
  Button,
  makeStyles,
  Container,
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
import { Skeleton } from "@material-ui/lab";

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
    paddingBottom: theme.spacing(2),
  },
  text: {
    marginTop: theme.spacing(2),
  },
}));

function PutOnApplicationDetail() {
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
  const queryKey = ["puton", params.id, authState.token];
  const { data = {}, isLoading } = useQuery(
    queryKey,
    (key, id, token) => getPutonApplication(id, token),
    {
      onSuccess: (data) => {
        ReactDOM.unstable_batchedUpdates(() => {
          setApplicationStatus(data.status);
        });
      },
    }
  );
  const [mutate] = useMutation(updatePutonApplication, {
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

  return (
    <>
      <Container maxWidth="sm">
        <Paper className={classes.paper}>
          {!isLoading ? (
            <>
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
                  <form
                    noValidate
                    onSubmit={handleSubmit}
                    className={classes.form}
                  >
                    <FormControl
                      variant="outlined"
                      fullWidth
                      className={classes.input}
                    >
                      <InputLabel id="status">Status</InputLabel>
                      <Select
                        labelId="status"
                        value={applicationStatus}
                        onChange={(e) => setApplicationStatus(e.target.value)}
                        label="status"
                        // disabled
                      >
                        <MenuItem value={"unreviewed"}>Unreviewed</MenuItem>
                        <MenuItem value={"agree"}>Agree</MenuItem>
                        <MenuItem value={"refuse"}>Refuse</MenuItem>
                      </Select>
                    </FormControl>
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
                    <Typography className={classes.text} variant="h6">
                      Candidate
                    </Typography>
                    <Typography variant="subtitle1">
                      {data.candidate.username}
                    </Typography>
                    <Typography className={classes.text} variant="h6">
                      Usage
                    </Typography>
                    <Typography variant="subtitle1">{data.usage}</Typography>
                    <Typography className={classes.text} variant="h6">
                      Reviewer
                    </Typography>
                    <Typography variant="subtitle1">
                      {data.reviewer.username}
                    </Typography>
                    <Typography className={classes.text} variant="h6">
                      Status
                    </Typography>
                    <Typography variant="subtitle1">{data.status}</Typography>
                  </Box>
                )}
              </Box>
            </>
          ) : (
            <Skeleton variant="rect"></Skeleton>
          )}
        </Paper>
      </Container>
    </>
  );
}

export default PutOnApplicationDetail;
