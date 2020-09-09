import React from "react";
import { TableCell, TableRow, Checkbox, IconButton } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { getAllLenderApplications, deleteLenderApplication } from "../utils";
import { Link as ReachLink } from "@reach/router";
import EnhancedTable from "./EnhancedTable";

const headCells = [
  { id: "id", th: true, disablePadding: true, label: "ID" },
  { id: "candidate", th: false, disablePadding: false, label: "Candidate" },
  { id: "lab_name", th: false, disablePadding: false, label: "LabName" },
  {
    id: "lab_location",
    th: false,
    disablePadding: false,
    label: "LabLocation",
  },
  { id: "status", th: false, disablePadding: false, label: "Status" },
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
        <TableCell align="right">{row.candidate.username}</TableCell>
        <TableCell align="right">{row.lab_name}</TableCell>
        <TableCell align="right">{row.lab_location}</TableCell>
        <TableCell align="right">{row.status}</TableCell>
        <TableCell align="right">
          <IconButton
            component={ReachLink}
            to={`/applications/lender/${row.id}`}
            state={{ status: "IDLE" }}
          >
            <VisibilityIcon></VisibilityIcon>
          </IconButton>
          <IconButton
            component={ReachLink}
            to={`/applications/lender/${row.id}`}
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
        <TableCell padding="checkbox">{/* <Checkbox
          /> */}</TableCell>
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

function LenderApplicationList() {
  return (
    <EnhancedTable
      headCells={headCells}
      resource="lender_applications"
      getAllResource={getAllLenderApplications}
      deleteResource={deleteLenderApplication}
      RowData={RowData}
    ></EnhancedTable>
  );
}

export default LenderApplicationList;
