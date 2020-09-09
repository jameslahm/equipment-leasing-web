import React from "react";
import { makeStyles } from "@material-ui/core";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";

const useStyles = makeStyles((theme) => ({
  success: {
    color: theme.palette.primary.main,
  },
  error: {
    color: theme.palette.secondary.main,
  },
}));

function ConfirmHint({ result }) {
  const classes = useStyles();
  return result ? (
    <CheckCircleOutlineIcon
      className={classes.success}
    ></CheckCircleOutlineIcon>
  ) : (
    <ErrorOutlineIcon className={classes.error}></ErrorOutlineIcon>
  );
}

export default ConfirmHint
