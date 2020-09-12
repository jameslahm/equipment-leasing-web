import React, { useContext, useState } from "react";
import {
  ChatContext,
  AuthContext,
  getMessage,
  generateMessage,
  formatDate,
  updateMessage,
  createMessage,
} from "utils";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Grid,
  Paper,
  Box,
  Typography,
  Button,
  makeStyles,
  Divider,
  Badge,
  ListItemSecondaryAction,
  IconButton,
} from "@material-ui/core";
import { useQuery, useMutation, queryCache } from "react-query";
import { useSnackbar } from "notistack";
import {
  navigate,
  useParams,
  Redirect,
  Link as ReachLink,
} from "@reach/router";
import { Skeleton } from "@material-ui/lab";
import { TextField } from "components/Widget";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  paper: {
    // minHeight: "400px",
    padding: theme.spacing(2),
  },
  content: {
    overflowWrap: "anywhere",
  },
  send: {
    marginLeft: theme.spacing(2),
    // marginRight:theme.spacing(2)
    marginTop: theme.spacing(1),
  },
  message: {
    padding: theme.spacing(1),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
}));

function ChatPanel() {
  const classes = useStyles();
  const { messages, setMessagesAndSave } = useContext(ChatContext);
  const params = useParams();
  const { authState, setAuthStateAndSave } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const [userId, setUserId] = useState(params.id);
  const [content, setContent] = useState("");
  const [mutateRead] = useMutation(updateMessage, {
    onSuccess: (data) => {
      queryCache.invalidateQueries(["messages", authState.token]);
    },
  });
  const [mutateSend] = useMutation(createMessage, {
    onSuccess: (data) => {
      // queryCache.invalidateQueries(["messages", userId, authState.token]);
      messages[userId].messages.push(data);
      setMessagesAndSave(messages);
    },
  });
  const { isLoading, isError } = useQuery(
    ["messages", userId, authState.token],
    (key, id, token) => getMessage(id, token),
    {
      refetchInterval: 5000,
      enabled: userId,
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
      onSuccess: (data) => {
        data.messages.forEach((m) => {
          console.log(m);
          const index = messages[userId].messages.findIndex(
            (message) => message.id === m.id
          );
          if (index === -1) {
            messages[userId].messages.push(m);
          }
        });
        setMessagesAndSave(messages);
        mutateRead(
          { id: userId, token: authState.token },
          { throwOnError: true }
        );
      },
    }
  );

  // useEffect(() => {
  //   if (userId && !messages[userId].isRead) {
  //     try {
  //       mutateRead(
  //         { id: userId, token: authState.token },
  //         { throwOnError: true }
  //       );
  //     } catch (e) {
  //       enqueueSnackbar("Update Fail", {
  //         variant: "error",
  //       });
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [userId]);

  const handleSend = () => {
    try {
      mutateSend(
        { id: userId, token: authState.token, content },
        { throwOnError: true }
      ).then((d) => {
        setContent("");
      });
    } catch (e) {
      enqueueSnackbar("Send Fail", {
        variant: "error",
      });
    }
  };

  if (userId && !messages[userId]) {
    return <Redirect to={`/users/${userId}`}></Redirect>;
  }

  return (
    <Paper className={classes.paper}>
      <Grid container>
        <Grid md={3} item>
          <List dense>
            {Object.entries(messages).map(([id, m], i) => {
              return (
                <ListItem
                  selected={id === userId}
                  key={i}
                  button
                  onClick={(e) => {
                    setUserId(id);
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      badgeContent={m.total}
                      color="secondary"
                      invisible={!m.total}
                    >
                      <Avatar src={m.avatar} />
                    </Badge>
                  </ListItemAvatar>

                  <ListItemText primary={m.username} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={(e) => {
                        delete messages[id];
                        setMessagesAndSave(messages);
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        </Grid>
        <Grid item md={1}>
          <Divider
            style={{ margin: "auto" }}
            orientation="vertical"
            variant="middle"
          />
        </Grid>
        <Grid item md={8}>
          {isLoading || isError ? (
            <Skeleton variant="rect" height="400px"></Skeleton>
          ) : userId ? (
            <Box display="flex" flexDirection="column" pr={2}>
              <Box flexGrow={1}>
                {messages[userId].messages.map((m) => {
                  const sender =
                    m.sender_id === authState.id
                      ? authState
                      : messages[m.sender_id];
                  return (
                    <Box
                      key={m.id}
                      display="flex"
                      flexDirection={
                        m.sender_id === authState.id ? "row-reverse" : "row"
                      }
                      alignItems="center"
                      my={2}
                    >
                      <Avatar
                        component={ReachLink}
                        to={`/users/${userId}`}
                        src={sender.avatar}
                        alt={sender.username}
                      ></Avatar>
                      <Box
                        mx={2}
                        display="flex"
                        flexDirection="column"
                        alignItems={
                          sender.id === authState.id ? "flex-end" : "flex-start"
                        }
                      >
                        <Typography variant="subtitle2" color="textSecondary">
                          {sender.username}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {formatDate(m.message_time)}
                        </Typography>
                      </Box>
                      <Box>
                        <Paper className={classes.message}>
                          <Typography
                            className={classes.content}
                            variant="body1"
                          >
                            {m.content}
                          </Typography>
                        </Paper>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
              <Box flexGrow={0} display="flex" alignItems="center">
                <TextField
                  size="small"
                  label="message"
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                  }}
                  multiline
                ></TextField>
                <Button
                  className={classes.send}
                  variant="contained"
                  disabled={!content}
                  onClick={handleSend}
                  color="primary"
                >
                  Send
                </Button>
              </Box>
            </Box>
          ) : null}
        </Grid>
      </Grid>
    </Paper>
  );
}

export default ChatPanel;
