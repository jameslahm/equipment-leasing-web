import { useQuery, useMutation } from "react-query";
import {
  Box,
  Card,
  CardHeader,
  Avatar,
  IconButton,
  CardContent,
  Typography,
  Paper,
  makeStyles,
  Button,
} from "@material-ui/core";
import React, { useState, useContext } from "react";
import { useParams, navigate } from "@reach/router";
import {
  AuthContext,
  getAllComments,
  formatDate,
  createComment,
  deleteComment,
  generateMessage,
} from "utils";
import { Skeleton, Pagination, Rating } from "@material-ui/lab";
import DeleteIcon from "@material-ui/icons/Delete";
import { TextField } from "components/Widget";
import { useSnackbar } from "notistack";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
  },
}));

function Comment() {
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const params = useParams();
  const { authState, setAuthStateAndSave } = useContext(AuthContext);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [errors, setErrors] = useState({ content: "" });
  const { enqueueSnackbar } = useSnackbar();

  const { data = {}, isLoading, isError } = useQuery(
    [
      "equipments",
      params.id,
      "comments",
      {
        page,
        page_size: pageSize,
      },
      authState.token,
    ],
    (_, equipment_id, __, options, token) =>
      getAllComments(equipment_id, options, token),
    {
      retry:false,
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

  const [mutateCreate] = useMutation(createComment);
  const [mutateDelete] = useMutation(deleteComment);

  const handleCreate = async () => {
    errors.content = content ? "" : "Comment can't be empty";
    if (errors.content) {
      setErrors({ ...errors });
      return;
    }
    try {
      await mutateCreate(
        {
          id: params.id,
          data: { rating: rating, content: content },
          token: authState.token,
        },
        { throwOnError: true }
      );
      enqueueSnackbar(generateMessage(null, "/edit"), {
        variant: "success",
      });
    } catch (e) {
      enqueueSnackbar(generateMessage(e, "/edit"), {
        variant: "error",
      });
    }
  };

  const handleDelete = async (id) => {
    console.log(id)
    try {
      await mutateDelete(
        {
          id: id,
          equipment_id: params.id,
          token: authState.token,
        },
        { throwOnError: true }
      );
      enqueueSnackbar(generateMessage(null, "/edit"), {
        variant: "success",
      });
    } catch (e) {
      enqueueSnackbar(generateMessage(e, "/edit"), {
        variant: "error",
      });
    }
  };

  if (isLoading || isError) {
    return <Skeleton variant="rect" height="400px"></Skeleton>;
  }

  return (
    <Box>
      <Paper className={classes.paper}>
        <Rating name="rating" value={rating} onChange={(e, v) => setRating(v)}></Rating>
        <TextField
          multiline
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
          label="content"
        ></TextField>
        <Box mt={1} display="flex" justifyContent="flex-end">
          <Button
            onClick={(e) => {
              handleCreate();
            }}
            variant="contained"
            color="primary"
          >
            Comment
          </Button>
        </Box>
      </Paper>
      {data.comments.map((comment, i) => {
        return (
          <Box key={i}>
            <Card>
              <CardHeader
                avatar={<Avatar src={comment.user.avatar} alt="Rsdad"></Avatar>}
                action={
                  authState.role === "admin" ||
                  authState.id === comment.user.id ? (
                    <IconButton onClick={(e) => handleDelete(comment.id)}>
                      <DeleteIcon />
                    </IconButton>
                  ) : null
                }
                title={comment.user.username}
                subheader={<>{formatDate(comment.comment_time)}</>}
              />
              <CardContent>
                <Rating value={comment.rating} readOnly />
                <Box pl={0.5} mt={1}>
                  <Typography variant="body1">{comment.content}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        );
      })}
      <Box display="flex" justifyContent="flex-end" mt={4}>
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

export default Comment;
