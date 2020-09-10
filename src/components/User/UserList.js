import React, { useState, useContext } from "react";
import {
  TableCell,
  TableRow,
  Checkbox,
  IconButton,
  Avatar,
  makeStyles,
  Box,
} from "@material-ui/core";
import clsx from "clsx";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { getAllUsers, deleteUser, AuthContext } from "utils";
import { Link as ReachLink, Redirect } from "@reach/router";
import EnhancedTable, { TableRowSkeleton } from "components/EnhancedTable";
import { ConfirmHint } from "components/Widget";
import { EnhancedTableToolbar } from "components/EnhancedTable";
import FilterListIcon from "@material-ui/icons/FilterList";
import { TextField } from "components/Widget";
import { useSnackbar } from "notistack";
// Table Header
const headCells = [
  { id: "id", th: true, label: "ID", sortable: true },
  { id: "username", th: false, label: "Username", sortable: true },
  { id: "email", th: false, label: "Email" },
  { id: "avatar", th: false, label: "Avatar" },
  { id: "role", th: false, label: "Role" },
  { id: "confirmed", th: false, label: "Confirmed" },
  {
    id: "actions",
    label: "Actions",
    th: false,
  },
];

const useStyles = makeStyles((theme) => ({
  tableCell: {
    textAlign: "right",
  },
  capitalize: {
    textTransform: "capitalize",
  },
}));

function RowData({
  row,
  isItemSelected,
  labelId,
  isLoading,
  onDelete,
  onClick,
}) {
  const classes = useStyles();

  if (!isLoading) {
    return (
      <TableRow hover>
        <TableCell padding="checkbox">
          <Checkbox
            checked={isItemSelected}
            inputProps={{ "aria-labelledby": labelId }}
            onClick={(event) => onClick(event, row.id)}
          />
        </TableCell>
        <TableCell component="th" id={labelId} scope="row" padding="none">
          {row.id}
        </TableCell>
        <TableCell className={classes.tableCell}>{row.username}</TableCell>
        <TableCell className={classes.tableCell}>{row.email}</TableCell>
        <TableCell className={classes.tableCell}>
          <Box display="flex" justifyContent="flex-end">
            <Avatar src={row.avatar} alt={row.username}></Avatar>
          </Box>
        </TableCell>
        <TableCell className={clsx([classes.tableCell, classes.capitalize])}>
          {row.role}
        </TableCell>
        <TableCell className={classes.tableCell}>
          <ConfirmHint result={row.confirmed}></ConfirmHint>
        </TableCell>
        <TableCell className={classes.tableCell}>
          <IconButton
            component={ReachLink}
            to={`/users/${row.id}`}
            state={{ status: "IDLE" }}
          >
            <VisibilityIcon></VisibilityIcon>
          </IconButton>
          <IconButton
            component={ReachLink}
            to={`/users/${row.id}`}
            state={{ status: "EDIT" }}
          >
            <EditIcon></EditIcon>
          </IconButton>
          <IconButton onClick={() => onDelete(row.id)}>
            <DeleteIcon></DeleteIcon>
          </IconButton>
        </TableCell>
      </TableRow>
    );
  } else {
    return <TableRowSkeleton columns={7}></TableRowSkeleton>;
  }
}

const useToolbarStyles = makeStyles((theme) => ({
  input: {
    maxWidth: "300px",
    marginRight: theme.spacing(2),
  },
}));

function TableToolbar({ numSelected, onFilter, onDeleteAll }) {
  const classes = useToolbarStyles();
  const [username, setUsername] = useState("");

  const handleClick = () => {
    onFilter({ username: username });
  };

  return (
    <EnhancedTableToolbar numSelected={numSelected} onDeleteAll={onDeleteAll}>
      <Box
        width="100%"
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
      >
        <TextField
          size="small"
          className={classes.input}
          label="username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        ></TextField>
        <IconButton onClick={handleClick}>
          <FilterListIcon></FilterListIcon>
        </IconButton>
      </Box>
    </EnhancedTableToolbar>
  );
}

function UserList() {
  const { authState } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  if (authState.role !== "admin") {
    enqueueSnackbar("Sorry, you have no permission", {
      variant: "error",
    });
    return <Redirect to="/" noThrow></Redirect>;
  }

  return (
    <EnhancedTable
      headCells={headCells}
      resource="users"
      getAllResource={getAllUsers}
      deleteResource={deleteUser}
      RowData={RowData}
      TableToolbar={TableToolbar}
    ></EnhancedTable>
  );
}

export default UserList;
