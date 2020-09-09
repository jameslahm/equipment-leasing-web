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
import { getAllPutOnApplications, deletePutOnApplication } from "../utils";
import { Link as ReachLink } from "@reach/router";
import EnhancedTable from "./EnhancedTable";
import TableRowSkeleton from "./EnhancedTable/TableRowSkeleton";
import StatusHint from "./StatusHint";

const headCells = [
  { id: "id", th: true, disablePadding: true, label: "ID" },
  { id: "candidate", th: false, disablePadding: false, label: "Candidate" },
  {
    id: "status",
    th: false,
    disablePadding: false,
    label: "Status",
  },
  { id: "review", th: false, disablePadding: false, label: "Review" },
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
        <TableCell className={classes.tableCell}>
          <StatusHint result={row.result}></StatusHint>
        </TableCell>
        <TableCell className={classes.tableCell}>
          <Link component={ReachLink} to={`/users/${row.reviewer.id}`}>
            {row.reviewer.username}
          </Link>
        </TableCell>
        <TableCell className={classes.tableCell}>
          <IconButton
            component={ReachLink}
            to={`/applications/puton/${row.id}`}
            state={{ status: "IDLE" }}
          >
            <VisibilityIcon></VisibilityIcon>
          </IconButton>
          <IconButton
            component={ReachLink}
            to={`/applications/puton/${row.id}`}
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
    return <TableRowSkeleton columns={5}></TableRowSkeleton>;
  }
}

function PutOnApplicationList() {
  return (
    <EnhancedTable
      headCells={headCells}
      resource="equipment_puton_applications"
      getAllResource={getAllPutOnApplications}
      deleteResource={deletePutOnApplication}
      RowData={RowData}
    ></EnhancedTable>
  );
}

export default PutOnApplicationList;
