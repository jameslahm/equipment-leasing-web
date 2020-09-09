import React, { useState, useContext } from "react";
import { useLocation, useParams } from "@reach/router";
import { useQuery, useMutation, queryCache } from "react-query";
import { AuthContext,canEdit } from "../utils";
import {
  Button,
  makeStyles,
  CardActions,
  Paper,
  Box,
  IconButton,
  Grid,
  Typography,
} from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import { useSnackbar } from "notistack";
import { Skeleton } from "@material-ui/lab";
import {
  Timeline,
  TimelineItem,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@material-ui/lab";
import AssignmentIcon from "@material-ui/icons/Assignment";
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
  textCenter: {
    textAlign: "center",
  },
}));

function ApplicationDetail({
  resource,
  getResource,
  updateResource,
  ResourceDetail,
}) {
  const classes = useStyles();
  const params = useParams();
  const location = useLocation();
  const { authState } = useContext(AuthContext);
  const initialStatus = location.state
    ? location.state.status
      ? location.state.status
      : "IDLE"
    : "IDLE";
  const [status, setStatus] = useState(initialStatus);
  const queryKey = [resource, params.id, authState.token];
  const { data = {}, isLoading } = useQuery(queryKey, (key, id, token) =>
    getResource(id, token)
  );
  const [mutate] = useMutation(updateResource, {
    onSuccess: (data) => queryCache.setQueryData(queryKey, data),
  });

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (v) => {
    try {
      await mutate({
        data: { status: v },
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
        {canEdit(authState, { id: params.id }) ? (
          data.status === "unreviewed" ? (
            status === "IDLE" ? (
              <IconButton onClick={() => setStatus("EDIT")}>
                <EditIcon></EditIcon>
              </IconButton>
            ) : (
              <IconButton onClick={() => setStatus("IDLE")}>
                <VisibilityIcon></VisibilityIcon>
              </IconButton>
            )
          ) : null
        ) : null}
      </Box>
      <Grid container>
        <Grid item md={7}>
          <ResourceDetail data={data}></ResourceDetail>
          {status === "EDIT" && data.status === "unreviewed" ? (
            <CardActions>
              <Button
                // size="small"
                variant="contained"
                color="primary"
                onClick={(e) => {
                  handleSubmit("agree");
                }}
              >
                Agree
              </Button>
              <Button
                // size="small"
                variant="contained"
                color="primary"
                onClick={(e) => {
                  handleSubmit("refuse");
                }}
              >
                Reject
              </Button>
            </CardActions>
          ) : null}
        </Grid>
        <Grid item md={5}>
          <Timeline align="alternate">
            <TimelineItem>
              <TimelineOppositeContent>
                <Typography variant="body2" color="textSecondary">
                  {data.status === "unreviewed"
                    ? new Date().toISOString()
                    : data.review_time}
                </Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot
                  color={data.status === "agree" ? "primary" : "secondary"}
                >
                  <StatusHint result={data.status}></StatusHint>
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Paper elevation={3} className={classes.textCenter}>
                  <Typography>
                    {data.status === "unreviewed"
                      ? "Unreviewed"
                      : "Review: " + data.status}
                  </Typography>
                </Paper>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineOppositeContent>
                <Typography variant="body2" color="textSecondary">
                  {data.application_time}
                </Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color="primary">
                  <AssignmentIcon />
                </TimelineDot>
              </TimelineSeparator>
              <TimelineContent>
                <Paper elevation={3} className={classes.textCenter}>
                  <Typography>Send Application</Typography>
                </Paper>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default ApplicationDetail;
