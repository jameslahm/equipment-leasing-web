import React from "react";
import { getAllNotifications, deleteNotification } from "../utils";
import EnhancedTable from "./EnhancedTable";
import { Link as ReachLink } from "@reach/router";
import { TableCell, TableRow, Checkbox, IconButton } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

const headCells = [
  { id: "id", th: true, disablePadding: true, label: "ID" },
  { id: "sender", th: false, disablePadding: false, label: "Sender" },
  { id: "result", th: false, disablePadding: false, label: "Result" },
  { id: "isRead", th: false, disablePadding: false, label: "isRead" },
  {
    id: "type",
    th: false,
    disablePadding: false,
    label: "Type",
  },
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
            onClick={(event) => onClick(event, row.id)}
          />
        </TableCell>
        <TableCell component="th" id={labelId} scope="row" padding="none">
          {row.id}
        </TableCell>
        <TableCell align="right">{row.sender.username}</TableCell>
        <TableCell align="right">{row.result}</TableCell>
        <TableCell align="right">{row.isRead}</TableCell>
        <TableCell align="right">{row.type}</TableCell>
        <TableCell align="right">
          <IconButton
            component={ReachLink}
            to={`/notifications/${row.id}`}
            state={{ status: "IDLE" }}
          >
            <VisibilityIcon></VisibilityIcon>
          </IconButton>
          <IconButton
            component={ReachLink}
            to={`/notifications/${row.id}`}
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
          {/* <Checkbox /> */}
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

function EquipmentList() {
  return (
    <EnhancedTable
      headCells={headCells}
      resource="notifications"
      getAllResource={getAllNotifications}
      deleteResource={deleteNotification}
      RowData={RowData}
    ></EnhancedTable>
  );
}

export default EquipmentList;
