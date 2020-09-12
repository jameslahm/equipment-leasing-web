import React, { useContext } from "react";
import { useParams, Link as ReachLink, navigate } from "@reach/router";
import { useQuery, useMutation, queryCache } from "react-query";
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

function generateContent(data) {
  if(data.type==='return'){
    return `Your application has been returned back, Please confirm as soon as possible`
  }
  if (data.result === "agree") {
    return `Congratulations, ${data.sender.username} has agreed your application, Please check soon`;
  }
  if (data.result === "refuse") {
    return `Sorry, ${data.sender.username} has refused your application`;
  }
  if (data.type === "lender") {
    return `Hi, ${data.sender.username} has applied to be a Lender, Please review as soon as possible`;
  }
  if (data.type === "borrow") {
    return `Hi, ${data.sender.username} has applied to borrow your equipment, Please review as soon as possible`;
  }
  if (data.type === "puton") {
    return `Hi, ${data.sender.username} has applied to put on a equipment, Please review as soon as possible`;
  }
}

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
  const { authState,setAuthStateAndSave } = useContext(AuthContext);
  const queryKey = ["notification", params.id, authState.token];
  const [mutate] = useMutation(updateNotification);
  const { data = {}, isLoading, isError } = useQuery(
    queryKey,
    (key, id, token) => getNotification(id, token),
    {
      retry: false,
      // staleTime: Infinity,
      onError: (e) => {
        enqueueSnackbar(generateMessage(e, "/list"), {
          variant: "error",
        });
        
        if (e.status === 401) {
          setAuthStateAndSave(null)
          navigate("/login");
        }
        if (e.status === 404){
          navigate("/")
        }
      },
      onSuccess: (data) => {
        if (!data.isRead)
          mutate(
            { data: { isRead: true }, id: params.id, token: authState.token },
            { throwOnError: true }
          )
            .then((res) => {
              queryCache.invalidateQueries([
                "notifications",
                {
                  isRead: false,
                  total: true,
                },
                (authState || {}).token,
              ]);
            })
            .catch((e) => console.log(e));
      },
    }
  );

  if (isLoading || isError) {
    return <Skeleton variant="rect" height="400px"></Skeleton>;
  }

  return (
    <Paper className={classes.paper}>
      <Typography gutterBottom variant="body1">
        {generateContent(data)}
      </Typography>
      <Link
        component={ReachLink}
        to={`/applications/${data.type==='return'?'borrow':data.type}/${data.application_id}`}
      >
        See Application
      </Link>
    </Paper>
  );
}

export default EquipmentDetail;
