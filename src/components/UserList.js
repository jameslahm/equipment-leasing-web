import React from "react";
import { TableCell, TableRow, Checkbox, IconButton } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { getAllUsers, deleteUser } from "../utils";
import { Link as ReachLink } from "@reach/router";
import EnhancedTable from "./EnhancedTable";

const headCells = [
  { id: "username", th: true, disablePadding: true, label: "Username" },
  { id: "email", th: false, disablePadding: false, label: "Email" },
  { id: "avatar", th: false, disablePadding: false, label: "Avatar" },
  { id: "role", th: false, disablePadding: false, label: "Role" },
  { id: "confirmed", th: false, disablePadding: false, label: "Confirmed" },
  {
    id: "actions",
    label: "Actions",
    th: false,
  },
];

function RowData({
  row,
  isItemSelected,
  labelId,
  isLoading,
  onDelete,
  onClick,
}) {
  if (!isLoading) {
    return (
      <TableRow
        hover
        aria-checked={isItemSelected}
        tabIndex={-1}
        selected={isItemSelected}
      >
        <TableCell padding="checkbox">
          <Checkbox
            checked={isItemSelected}
            inputProps={{ "aria-labelledby": labelId }}
            onClick={(event) => onClick(event, row.username)}
          />
        </TableCell>
        <TableCell component="th" id={labelId} scope="row" padding="none">
          {row.username}
        </TableCell>
        <TableCell align="right">{row.email}</TableCell>
        <TableCell align="right">{row.avatar}</TableCell>
        <TableCell align="right">{row.role}</TableCell>
        <TableCell align="right">
          {row.confirmed ? "Confirmed" : "UnConfirmed"}
        </TableCell>
        <TableCell align="right">
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
    return (
      <TableRow hover tabIndex={-1}>
        <TableCell padding="checkbox">
        {/* <Checkbox
          /> */}
        </TableCell>
        <TableCell component="th" scope="row" padding="none">
          <Skeleton variant="rect"></Skeleton>
        </TableCell>
        <TableCell align="right">
          <Skeleton variant="rect"></Skeleton>
        </TableCell>
        <TableCell align="right">
          <Skeleton variant="rect"></Skeleton>
        </TableCell>
        <TableCell align="right">
          <Skeleton variant="rect"></Skeleton>
        </TableCell>
        <TableCell align="right">
          <Skeleton variant="rect"></Skeleton>
        </TableCell>
        <TableCell align="right">
          <Skeleton variant="rect"></Skeleton>
        </TableCell>
      </TableRow>
    );
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
