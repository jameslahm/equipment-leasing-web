import React, { useState, useContext } from "react";
import { useLocation, useParams, navigate } from "@reach/router";
import { useQuery, useMutation, queryCache } from "react-query";
import {
  AuthContext,
  canEdit,
  formatDate,
  generateMessage,
  capitalize,
} from "utils";
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
import { StatusHint } from "components/Widget";

const useStyles = makeStyles((theme) => ({
  paper: {
    paddingTop: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(4),
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
  action: {
    paddingLeft: theme.spacing(2),
  },
  content:{
    marginLeft:theme.spacing(2)
  }
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
  const { authState, setAuthStateAndSave } = useContext(AuthContext);
  const initialStatus = location.state
    ? location.state.status
      ? location.state.status
      : "IDLE"
    : "IDLE";
  const [status, setStatus] = useState(initialStatus);
  const queryKey = [resource, params.id, authState.token];
  const { data = {}, isLoading, isError } = useQuery(
    queryKey,
    (key, id, token) => getResource(id, token),
    {
      retry: false,
      onError: (e) => {
        enqueueSnackbar(generateMessage(e), {
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
  const [mutate] = useMutation(updateResource, {
    onSuccess: (data) => queryCache.setQueryData(queryKey, data),
  });

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (v) => {
    try {
      await mutate(
        {
          data: { status: v },
          id: params.id,
          token: authState.token,
        },
        { throwOnError: true }
      );
      enqueueSnackbar("Review Success", {
        variant: "success",
      });
    } catch (e) {
      enqueueSnackbar("Review Fail", {
        variant: "error",
      });
    }
  };

  if (isLoading || isError) {
    return <Skeleton variant="rect" height="400px"></Skeleton>;
  }

  return (
    <Paper className={classes.paper}>
      <Box position="absolute" right={4} top={4}>
        {canEdit(authState, { id: (data.reviewer || {}).id }) ? (
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
            <CardActions className={classes.action}>
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
          <Box mr={4}>
            <Timeline align="alternate">
              <TimelineItem>
                <TimelineOppositeContent>
                  <Typography variant="body2" color="textSecondary">
                    {formatDate(
                      data.status === "unreviewed"
                        ? new Date()
                        : data.review_time
                    )}
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
                        : "Review: " + capitalize(data.status)}
                    </Typography>
                  </Paper>
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineOppositeContent>
                  <Typography variant="body2" color="textSecondary">
                    {formatDate(data.application_time)}
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
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default ApplicationDetail;
