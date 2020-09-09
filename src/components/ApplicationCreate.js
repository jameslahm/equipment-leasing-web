import React, { useState } from "react";
import { Paper, makeStyles, Button } from "@material-ui/core";
import TextField from "./TextField";
import {
  createLenderApplication,
  createPutOnApplication,
  createBorrowApplication,
} from "../utils";
import { useMutation } from "react-query";
import { useSnackbar } from "notistack";
import { navigate, useParams } from "@reach/router";

const useStyles = makeStyles((theme) => ({
  form: {
    margin: "auto",
    maxWidth: "500px",
  },
  paper: {
    padding: `${theme.spacing(2)}px ${theme.spacing(2)}px`,
    paddingBottom: theme.spacing(4),
  },
  submit: {
    marginTop: theme.spacing(2),
  },
}));

function ApplicationCreate({ type }) {
  switch (type) {
    case "lender": {
      return <LenderApplicationCreate></LenderApplicationCreate>;
    }
    case "puton": {
      return <PutOnApplicationCreate></PutOnApplicationCreate>;
    }
    case "borrow": {
      return <BorrowApplicationCreate></BorrowApplicationCreate>;
    }
    default: {
      return <LenderApplicationCreate></LenderApplicationCreate>;
    }
  }
}

function BorrowApplicationCreate() {
  const classes = useStyles();
  const params = useParams();
  const [usage, setUsage] = useState("");
  const [errors, setErrors] = useState({ usage: "" });

  const [mutate] = useMutation(createBorrowApplication);
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();

    errors.usage = usage ? "" : "Usage can't be empty";

    if (errors.usage) {
      setErrors({ ...errors });
      return;
    }

    try {
      const data = await mutate(
        {
          data: { usage, equipment_id: params.id },
        },
        { throwOnError: true }
      );
      enqueueSnackbar("Apply Success", {
        variant: "success",
      });
      navigate(`/applications/borrow/${data.id}`);
    } catch (e) {
      enqueueSnackbar("Apply Fail", {
        variant: "error",
      });
    }
  };

  return (
    <Paper className={classes.paper}>
      <form className={classes.form} noValidate onSubmit={handleSubmit}>
        <TextField
          multiline
          rows={5}
          rowsMax={20}
          error={!!errors.usage}
          helperText={errors.usage}
          label="usage"
          value={usage}
          onChange={(e) => {
            setUsage(e.target.value);
          }}
        ></TextField>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Submit
        </Button>
      </form>
    </Paper>
  );
}

function PutOnApplicationCreate() {
  const classes = useStyles();
  const [name, setName] = useState("");
  const [usage, setUsage] = useState("");
  const [errors, setErrors] = useState({ name: "", usage: "" });

  const [mutate] = useMutation(createPutOnApplication);
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();

    errors.name = name ? "" : "Name can't be empty";
    errors.usage = usage ? "" : "Usage can't be empty";

    if (errors.name || errors.usage) {
      setErrors({ ...errors });
      return;
    }

    try {
      const data = await mutate(
        {
          data: { name, usage },
        },
        { throwOnError: true }
      );
      enqueueSnackbar("Apply Success", {
        variant: "success",
      });
      navigate(`/applications/puton/${data.id}`);
    } catch (e) {
      enqueueSnackbar("Apply Fail", {
        variant: "error",
      });
    }
  };

  return (
    <Paper className={classes.paper}>
      <form className={classes.form} noValidate onSubmit={handleSubmit}>
        <TextField
          error={!!errors.name}
          helperText={errors.name}
          label="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        ></TextField>
        <TextField
          multiline
          rows={5}
          rowsMax={20}
          error={!!errors.usage}
          helperText={errors.usage}
          label="usage"
          value={usage}
          onChange={(e) => {
            setUsage(e.target.value);
          }}
        ></TextField>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Submit
        </Button>
      </form>
    </Paper>
  );
}

function LenderApplicationCreate() {
  const classes = useStyles();
  const [labName, setLabName] = useState("");
  const [labLocation, setLabLocation] = useState("");
  const [errors, setErrors] = useState({ labName: "", labLocation: "" });

  const [mutate] = useMutation(createLenderApplication);
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();

    errors.labName = labName ? "" : "LabName can't be empty";
    errors.labLocation = labLocation ? "" : "LabLocation can't be empty";

    if (errors.labLocation || errors.labName) {
      setErrors({ ...errors });
      return;
    }

    try {
      const data = await mutate(
        {
          data: { lab_name: labName, lab_location: labLocation },
        },
        { throwOnError: true }
      );
      enqueueSnackbar("Apply Success", {
        variant: "success",
      });
      navigate(`/applications/lender/${data.id}`);
    } catch (e) {
      enqueueSnackbar("Apply Fail", {
        variant: "error",
      });
    }
  };

  return (
    <Paper className={classes.paper}>
      <form className={classes.form} noValidate onSubmit={handleSubmit}>
        <TextField
          error={!!errors.labName}
          helperText={errors.labName}
          label="LabName"
          value={labName}
          onChange={(e) => {
            setLabName(e.target.value);
          }}
        ></TextField>
        <TextField
          error={!!errors.labLocation}
          helperText={errors.labLocation}
          label="LabLocation"
          value={labLocation}
          onChange={(e) => {
            setLabLocation(e.target.value);
          }}
        ></TextField>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Submit
        </Button>
      </form>
    </Paper>
  );
}

export default ApplicationCreate;
