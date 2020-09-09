import React from "react";
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
import { getAllUsers, deleteUser } from "../utils";
import { Link as ReachLink } from "@reach/router";
import EnhancedTable from "./EnhancedTable";
import TableRowSkeleton from "./EnhancedTable/TableRowSkeleton";
import ConfirmHint from './ConfirmHint'

// Table Header
const headCells = [
  { id: "id", th: true, label: "ID" },
  { id: "username", th: false, label: "Username" },
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

function UserList() {
  return (
    <EnhancedTable
      headCells={headCells}
      resource="users"
      getAllResource={getAllUsers}
      deleteResource={deleteUser}
      RowData={RowData}
    ></EnhancedTable>
  );
}

export default UserList;
