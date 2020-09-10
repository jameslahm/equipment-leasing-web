import React, { useEffect,useContext } from "react";
import { confirmUser,AuthContext } from "utils";
import { useLocation,navigate } from "@reach/router";
import { useMutation } from "react-query";
import qs from "query-string";
import { CircularProgress, Paper, Typography,makeStyles } from "@material-ui/core";
import {useSnackbar} from 'notistack'

const useStyles=makeStyles(theme=>({
  paper:{
    padding:theme.spacing(4)
  },
  progress:{
    marginTop:theme.spacing(2)
  }
}))

function UserConfirm() {
  const classes=useStyles()
  const location = useLocation();
  const params = qs.parse(location.search);
  const [mutate]=useMutation(confirmUser)
  const {setAuthStateAndSave}=useContext(AuthContext)
  const {enqueueSnackbar}=useSnackbar()

  useEffect(()=>{
    mutate(params.confirmToken).then((data)=>{
      setAuthStateAndSave(data)
      enqueueSnackbar("Confirm Success",{
        variant:"success"
      })
      navigate(`/`)
    }).catch(err=>{
      enqueueSnackbar("Confirm Fail",{
        variant:"error"
      })
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <Paper className={classes.paper}>
      <Typography>Confirming......</Typography>
      <CircularProgress className={classes.progress}></CircularProgress>
    </Paper>
  );
}

export default UserConfirm;
