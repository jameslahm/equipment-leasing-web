import React, { useContext } from "react";
import {
  TableCell,
  TableRow,
  Checkbox,
  IconButton,
  makeStyles,
  Link,
  Box,
} from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  getAllLenderApplications,
  deleteLenderApplication,
  AuthContext,
  formatDate,
} from "utils";
import { Link as ReachLink } from "@reach/router";
import EnhancedTable, {
  TableRowSkeleton,
  EnhancedTableToolbar,
} from "components/EnhancedTable";
import { StatusHint } from "components/Widget";
import AddIcon from "@material-ui/icons/Add";

const headCells = [
  { id: "id", th: true, label: "ID",sortable:true },
  { id: "candidate", label: "Candidate" },
  { id: "lab_name", label: "LabName" },
  {
    id: "lab_location",
    label: "LabLocation",
  },
  { id: "application_time", label: "ApplicationTime", sortable: true },
  { id: "status", label: "Status" },
  {
    id: "actions",
    label: "Actions",
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
  const { authState } = useContext(AuthContext);
  if (!isLoading) {
    return (
      <TableRow
        hover
        aria-checked={isItemSelected}
        tabIndex={-1}
        selected={isItemSelected}
      >
        <TableCell padding="checkbox">
          {authState.role === "admin" ? (
            <Checkbox
              checked={isItemSelected}
              inputProps={{ "aria-labelledby": labelId }}
              onClick={(event) => onClick(event, row.id)}
            />
          ) : null}
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
          {formatDate(row.application_time)}
        </TableCell>
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
          {authState.role === "admin" ? (
            <IconButton onClick={() => onDelete(row.id)}>
              <DeleteIcon></DeleteIcon>
            </IconButton>
          ) : null}
        </TableCell>
      </TableRow>
    );
  } else {
    return <TableRowSkeleton columns={6}></TableRowSkeleton>;
  }
}

function TableToolbar({ numSelected, onFilter, onDeleteAll }) {
  const { authState } = useContext(AuthContext);
  return (
    <EnhancedTableToolbar numSelected={numSelected} onDeleteAll={onDeleteAll}>
      <Box width="100%" display="flex" justifyContent="flex-end">
        {authState.role === "normal" ? (
          <IconButton component={ReachLink} to={`/applications/lender/create`}>
            <AddIcon></AddIcon>
          </IconButton>
        ) : null}
      </Box>
    </EnhancedTableToolbar>
  );
}

function LenderApplicationList() {
  return (
    <EnhancedTable
      headCells={headCells}
      resource="lender_applications"
      getAllResource={getAllLenderApplications}
      deleteResource={deleteLenderApplication}
      RowData={RowData}
      TableToolbar={TableToolbar}
    ></EnhancedTable>
  );
}

export default LenderApplicationList;
