import React, { useContext, useEffect } from "react";
import { useParams, Link as ReachLink,navigate } from "@reach/router";
import { useQuery, useMutation } from "react-query";
import {
  AuthContext,
  getNotification,
  updateNotification,
  generateMessage,
} from "utils";
import { makeStyles, Paper, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { Link } from "@material-ui/core";
import { useSnackbar } from "notistack";

const useStyles = makeStyles((theme) => ({
  paper: {
    paddingTop: theme.spacing(4),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(2),
  },
}));

function EquipmentDetail() {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const params = useParams();
  const { authState } = useContext(AuthContext);
  const queryKey = ["notification", params.id, authState.token];
  const { data = {}, isLoading, isError } = useQuery(
    queryKey,
    (key, id, token) => getNotification(id, token),
    {
      retry: false,
      onError: (e) => {
        enqueueSnackbar(generateMessage(e, "/list"));
        if (e.status === 401) {
          navigate("/login");
        }
      },
    }
  );

  const [mutate] = useMutation(updateNotification);

  useEffect(() => {
    mutate(
      { data: { isRead: true }, id: params.id, token: authState.token },
      { throwOnError: true }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading || isError) {
    return <Skeleton variant="rect" height="400px"></Skeleton>;
  }

  return (
    <Paper className={classes.paper}>
      <Typography gutterBottom variant="h5" component="h2">
        {data.content}
      </Typography>
      <Link
        component={ReachLink}
        to={`/applications/${data.type}/${data.application_id}`}
      >
        See Application
      </Link>
    </Paper>
  );
}

export default EquipmentDetail;
