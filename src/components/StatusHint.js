import React from "react";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  success: {
    color: theme.palette.success.main,
  },
  error: {
    color: theme.palette.error.main,
  },
}));

function StatusHint({ result }) {
  const classes = useStyles();
  return (
    <>
      {result === "agree" ? (
        <ThumbUpIcon className={classes.success}></ThumbUpIcon>
      ) : result === "refuse" ? (
        <ThumbDownIcon className={classes.error}></ThumbDownIcon>
      ) : (
        <HelpOutlineIcon></HelpOutlineIcon>
      )}
    </>
  );
}

export default StatusHint
