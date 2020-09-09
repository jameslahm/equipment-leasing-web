import React, { useState, useContext } from "react";
import { useLocation, useParams } from "@reach/router";
import { useQuery, useMutation, queryCache } from "react-query";
import {
  AuthContext,
  getEquipment,
  updateEquipment,
} from "../utils";
import {
  TextField,
  Button,
  makeStyles,
  Container,
  Switch,
  FormControlLabel,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Paper,
  Box,
  IconButton,
  Typography,
} from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import ReactDOM from "react-dom";
import { useSnackbar } from "notistack";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    margin: "auto",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  input: {
    marginTop: theme.spacing(2),
  },
  paper: {
    paddingTop: theme.spacing(2),
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(2),
  },
  text: {
    marginTop: theme.spacing(2),
  },
}));

function EquipmentDetail() {
  const classes = useStyles();
  const [name, setName] = useState("");
  const [usage, setUsage] = useState("");
  const [equipmentStatus, setEquipmentStatus] = useState("normal");
  const [owner, setOwner] = useState({});
  // const [avatar,setAvatar]=useState("")
  const [confirmedBack, setConfirmedBack] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    usage: "",
    equipmentStatus: "",
  });

  const params = useParams();
  const location = useLocation();
  const { authState } = useContext(AuthContext);
  const initialStatus = location.state
    ? location.state.status
      ? location.state.status
      : "IDLE"
    : "IDLE";
  const [status, setStatus] = useState(initialStatus);
  const queryKey = ["equipment", params.id, authState.token];
  useQuery(
    queryKey,
    (key, id, token) => getEquipment(id, token),
    {
      onSuccess: (data) => {
        ReactDOM.unstable_batchedUpdates(() => {
          setName(data.name);
          setUsage(data.usage);
          setEquipmentStatus(data.status);
          setConfirmedBack(data.confirmed_back);
          setOwner(data.owner);
        });
      },
    }
  );
  const [mutate] = useMutation(updateEquipment, {
    onSuccess: (data) => queryCache.setQueryData(queryKey, data),
  });

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (event) => {
    event.preventDefault();

    errors.name = name ? "" : "Name can't be empty";
    errors.usage = usage ? "" : "Usage can't be empty";
    errors.equipmentStatus = equipmentStatus ? "" : "Status can't be empty";

    if (errors.name || errors.equipmentStatus || errors.usage) {
      setErrors({ ...errors });
      return;
    }

    try {
      await mutate({
        data: { name, confirmed_back: confirmedBack, usage },
        id: params.id,
        token: authState.token,
      });
      enqueueSnackbar("Update Success", {
        variant: "success",
      });
    } catch (e) {
      enqueueSnackbar("Update Fail", {
        variant: "error",
      });
    }
  };

  return (
    <>
      <Container maxWidth="sm">
        <Paper className={classes.paper}>
          <Box display="flex" justifyContent="flex-end">
            {authState.role === "admin" || authState.id === params.id ? (
              status === "IDLE" ? (
                <IconButton onClick={() => setStatus("EDIT")}>
                  <EditIcon></EditIcon>
                </IconButton>
              ) : (
                <IconButton onClick={() => setStatus("IDLE")}>
                  <VisibilityIcon></VisibilityIcon>
                </IconButton>
              )
            ) : null}
          </Box>
          <Box paddingX={4}>
            {status === "EDIT" ? (
              <form noValidate onSubmit={handleSubmit} className={classes.form}>
                <TextField
                  error={!!errors.name}
                  helperText={errors.name}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <TextField
                  error={!!errors.usage}
                  helperText={errors.usage}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="usage"
                  label="Usage"
                  type="text"
                  id="usage"
                  value={usage}
                  onChange={(e) => setUsage(e.target.value)}
                />
                <FormControl
                  variant="outlined"
                  fullWidth
                  className={classes.input}
                >
                  <InputLabel id="role">Role</InputLabel>
                  <Select
                    labelId="status"
                    value={equipmentStatus}
                    onChange={(e) => setEquipmentStatus(e.target.value)}
                    label="status"
                    // disabled
                  >
                    <MenuItem value={"unreviewed"}>UnReviewed</MenuItem>
                    <MenuItem value={"idle"}>Idle</MenuItem>
                    <MenuItem value={"lease"}>Lease</MenuItem>
                  </Select>
                </FormControl>

                <FormControlLabel
                  className={classes.input}
                  control={
                    <Switch
                      value={confirmedBack}
                      onChange={(e) => setConfirmedBack(!confirmedBack)}
                    ></Switch>
                  }
                  label="ConfirmedBack"
                ></FormControlLabel>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Save
                </Button>
              </form>
            ) : (
              <Box>
                <Typography className={classes.text} variant="h6">
                  Name
                </Typography>
                <Typography variant="subtitle1">{name}</Typography>
                <Typography className={classes.text} variant="h6">
                  Owner
                </Typography>
                <Typography variant="subtitle1">{owner.username}</Typography>
                <Typography className={classes.text} variant="h6">
                  Status
                </Typography>
                <Typography variant="subtitle1">{equipmentStatus}</Typography>
                <Typography className={classes.text} variant="h6">
                  Confirmed
                </Typography>
                <Typography variant="subtitle1">
                  {confirmedBack ? "Confirmed" : "UnConfirmed"}
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </>
  );
}

export default EquipmentDetail;
