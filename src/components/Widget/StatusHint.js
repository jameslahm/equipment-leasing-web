import React from "react";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  success: {
    color: theme.palette.primary.main,
  },
  error: {
    color: theme.palette.secondary.main,
  },
}));

function StatusHint({ result, color = false }) {
  const classes = useStyles();
  return (
    <>
      {result === "agree" ? (
        <ThumbUpIcon className={color ? classes.success : ""}></ThumbUpIcon>
      ) : result === "refuse" ? (
        <ThumbDownIcon className={color ? classes.error : ""}></ThumbDownIcon>
      ) : (
        <HelpOutlineIcon
          className={color ? classes.error : ""}
        ></HelpOutlineIcon>
      )}
    </>
  );
}

export default StatusHint;
