import React, { useState, useContext } from "react";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineOppositeContent,
  TimelineDot,
  Skeleton,
  Pagination
} from "@material-ui/lab";
import {
  Paper,
  Typography,
  makeStyles,
  Box,
} from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import UpdateIcon from "@material-ui/icons/Update";
import { useQuery } from "react-query";
import { AuthContext, getLogs, generateMessage, formatDate } from "utils";
import { useSnackbar } from "notistack";
import { navigate } from "@reach/router";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
  secondaryTail: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

export default function CustomizedTimeline() {
  const classes = useStyles();
  const { page, setPage } = useState(1);
  const pageSize = 10;

  const { authState, setAuthStateAndSave } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const { data = {}, isError, isLoading } = useQuery(
    [
      "logs",
      {
        page: page,
        page_size: pageSize,
      },
      authState.token,
    ],
    (key, options, token) => getLogs(options, token),
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

  const ICONMAP = {
    insert: <AddCircleOutlineIcon></AddCircleOutlineIcon>,
    update: <UpdateIcon></UpdateIcon>,
    delete: <DeleteForeverIcon></DeleteForeverIcon>,
  };

  if (isLoading || isError) {
    return <Skeleton variant="rect" height="400px"></Skeleton>;
  }

  return (
    <Box maxWidth="80%">
      <Timeline align="alternate">
        {data.logs.map((log, i) => {
          return (
            <TimelineItem key={i}>
              <TimelineOppositeContent>
                <Typography variant="body2" color="textSecondary">
                  {formatDate(log.log_time)}
                </Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot
                  color={
                    log.type === "insert"
                      ? "primary"
                      : log.type === "update"
                      ? "primary"
                      : "secondary"
                  }
                  variant={log.type === "update" ? "outlined" : "default"}
                >
                  {ICONMAP[log.type]}
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Paper elevation={3} className={classes.paper}>
                  <Typography>{log.content}</Typography>
                </Paper>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={Math.ceil(data.total / pageSize)}
          page={page}
          onChange={(event, v) => setPage(v)}
          color="primary"
        />
      </Box>
    </Box>
  );
}
