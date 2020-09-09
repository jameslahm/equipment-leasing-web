import React from "react";
import {
  TableCell,
  TableRow,
  Checkbox,
  IconButton,
  makeStyles,
  Link,
} from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { getAllLenderApplications, deleteLenderApplication } from "../utils";
import { Link as ReachLink } from "@reach/router";
import EnhancedTable from "./EnhancedTable";
import TableRowSkeleton from "./EnhancedTable/TableRowSkeleton";
import StatusHint from "./StatusHint";

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
        <TableCell className={classes.tableCell}>
          <Link component={ReachLink} to={`/users/${row.candidate.id}`}>
            {row.candidate.username}
          </Link>
        </TableCell>
        <TableCell className={classes.tableCell}>{row.lab_name}</TableCell>
        <TableCell className={classes.tableCell}>{row.lab_location}</TableCell>
        <TableCell className={classes.tableCell}>
          <StatusHint color result={row.status}></StatusHint>
        </TableCell>
        <TableCell className={classes.tableCell}>
          <IconButton
            component={ReachLink}
            to={`/applications/lender/${row.id}`}
            state={{ status: "IDLE" }}
          >
            <VisibilityIcon></VisibilityIcon>
          </IconButton>
          {row.status === "unreviewed" ? (
            <IconButton
              component={ReachLink}
              to={`/applications/lender/${row.id}`}
              state={{ status: "EDIT" }}
            >
              <EditIcon></EditIcon>
            </IconButton>
          ) : null}
          <IconButton onClick={() => onDelete(row.id)}>
            <DeleteIcon></DeleteIcon>
          </IconButton>
        </TableCell>
      </TableRow>
    );
  } else {
    return <TableRowSkeleton columns={6}></TableRowSkeleton>;
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
