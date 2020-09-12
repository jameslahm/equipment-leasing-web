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
  Pagination,
} from "@material-ui/lab";
import clsx from "clsx";
import {
  Paper,
  Typography,
  makeStyles,
  Box,
  MenuItem,
  IconButton,
} from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import UpdateIcon from "@material-ui/icons/Update";
import { useQuery } from "react-query";
import { AuthContext, getLogs, generateMessage, formatDate } from "utils";
import { useSnackbar } from "notistack";
import { navigate } from "@reach/router";
import { TextField } from "components/Widget";
import { DateTimePicker } from "@material-ui/pickers";
import FilterListIcon from "@material-ui/icons/FilterList";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
  info: {
    backgroundColor: theme.palette.info.main,
  },
  success: {
    backgroundColor: theme.palette.success.main,
  },
  error: {
    backgroundColor: theme.palette.error.main,
  },
  warning: {
    backgroundColor: theme.palette.warning.main,
  },
  input: {
    maxWidth: "300px",
    marginLeft: theme.spacing(4),
  },
}));

function Logs() {
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { authState, setAuthStateAndSave } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  const [startTime, setStartTime] = useState(new Date(0));
  const [endTime, setEndTime] = useState(new Date());

  const [options, setOptions] = useState({
    type: "",
    startTime: new Date(0),
    endTime: new Date(),
  });

  const { data = {}, isError, isLoading } = useQuery(
    [
      "logs",
      {
        page: page - 1,
        page_size: pageSize,
        type: options.type,
        start_time: options.startTime.getTime(),
        end_time: options.endTime.getTime(),
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

  if (authState.role !== "admin") {
    return <div></div>;
  }

  if (isLoading || isError) {
    return <Skeleton variant="rect" height="400px"></Skeleton>;
  }

  return (
    <Box>
      <Box display="flex" alignItems="center">
        <TextField
          size="small"
          select
          className={classes.input}
          label="type"
          // value={options.type}
          defaultValue={options.type}
          onChange={(e) => {
            options.type = e.target.value;
          }}
        >
          <MenuItem key="1" value="">
            All
          </MenuItem>
          <MenuItem key="2" value="insert">
            Insert
          </MenuItem>
          <MenuItem key="3" value="update">
            Update
          </MenuItem>
          <MenuItem key="4" value="delete">
            Delete
          </MenuItem>
        </TextField>
        <DateTimePicker
          className={classes.input}
          variant="inline"
          label="Start Time"
          value={startTime}
          onChange={(v) => {
            setStartTime(v)
          }}
          format="yyyy/MM/dd HH:mm"
        ></DateTimePicker>
        <DateTimePicker
          className={classes.input}
          variant="inline"
          label="End Time"
          value={endTime}
          onChange={(v) => {
            setEndTime(v)
          }}
          format="yyyy/MM/dd HH:mm"
        ></DateTimePicker>
        <IconButton
          className={classes.input}
          onClick={(e) => setOptions({ ...options,startTime,endTime })}
        >
          <FilterListIcon></FilterListIcon>
        </IconButton>
      </Box>
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
                  className={clsx({
                    [classes.info]: log.type === "insert",
                    [classes.success]: log.type === "update",
                    [classes.warning]: log.type === "delete",
                  })}
                >
                  {ICONMAP[log.type]}
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Paper
                  elevation={3}
                  className={clsx({
                    [classes.paper]: true,
                    [classes.info]: log.type === "insert",
                    [classes.success]: log.type === "update",
                    [classes.warning]: log.type === "delete",
                  })}
                >
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

export default Logs;
