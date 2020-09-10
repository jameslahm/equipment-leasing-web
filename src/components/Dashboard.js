import React, { useContext } from "react";
import { Paper, makeStyles } from "@material-ui/core";
import Chart from "./Chart";
import { AuthContext } from "utils";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
}));

function Dashboard() {
  const classes = useStyles();
  const { authState } = useContext(AuthContext);
  if (authState.role !== "admin") {
    return <Paper className={classes.paper}>Hi {authState.username}</Paper>;
  }
  return (
    <Paper className={classes.paper}>
      <Chart></Chart>
    </Paper>
  );
}

export default Dashboard;
