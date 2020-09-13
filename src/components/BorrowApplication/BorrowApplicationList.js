// eslint-disable-next-line no-unused-vars
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
  getAllBorrowApplications,
  deleteBorrowApplication,
  formatDate,
  AuthContext,
} from "utils";
import { Link as ReachLink } from "@reach/router";
import EnhancedTable, {
  TableRowSkeleton,
  EnhancedTableToolbar,
} from "components/EnhancedTable";
import { StatusHint } from "components/Widget";

const headCells = [
  { id: "id", th: true, label: "ID", sortable: true },
  { id: "candidate", label: "Candidate" },
  {
    id: "application_time",
    label: "ApplicationTime",
    sortable: true,
  },
  {
    id: "status",
    label: "Status",
  },
  { id: "review", label: "Review" },
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
        <TableCell className={classes.tableCell}>
          {formatDate(row.application_time)}
        </TableCell>
        <TableCell className={classes.tableCell}>
          <StatusHint color result={row.status}></StatusHint>
        </TableCell>
        <TableCell className={classes.tableCell}>
          <Link component={ReachLink} to={`/users/${row.reviewer.id}`}>
            {row.reviewer.username}
          </Link>
        </TableCell>
        <TableCell className={classes.tableCell}>
          <IconButton
            component={ReachLink}
            to={`/applications/borrow/${row.id}`}
            state={{ status: "IDLE" }}
          >
            <VisibilityIcon></VisibilityIcon>
          </IconButton>
          {row.status === "unreviewed" ? (
            <IconButton
              component={ReachLink}
              to={`/applications/borrow/${row.id}`}
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
    return <TableRowSkeleton columns={5}></TableRowSkeleton>;
  }
}

function TableToolbar({ numSelected, onFilter, onDeleteAll }) {
  // const { authState } = useContext(AuthContext);
  return (
    <EnhancedTableToolbar numSelected={numSelected} onDeleteAll={onDeleteAll}>
      <Box width="100%" display="flex" justifyContent="flex-end"></Box>
    </EnhancedTableToolbar>
  );
}

function BorrowApplicationList() {
  return (
    <EnhancedTable
      headCells={headCells}
      resource="equipment_borrow_applications"
      getAllResource={getAllBorrowApplications}
      deleteResource={deleteBorrowApplication}
      RowData={RowData}
      TableToolbar={TableToolbar}
    ></EnhancedTable>
  );
}

export default BorrowApplicationList;
