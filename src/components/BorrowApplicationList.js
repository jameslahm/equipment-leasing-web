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
  AuthContext,
} from "../utils";
import { Link as ReachLink } from "@reach/router";
import EnhancedTable from "./EnhancedTable";
import TableRowSkeleton from "./EnhancedTable/TableRowSkeleton";
import StatusHint from "./StatusHint";
import EnhancedTableToolbar from "./EnhancedTable/EnhancedTableToolbar";
import AddIcon from "@material-ui/icons/Add";

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
          <StatusHint color result={row.result}></StatusHint>
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

function TableToolbar({ numSelected, onFilter }) {
  const { authState } = useContext(AuthContext);
  return (
    <EnhancedTableToolbar numSelected={numSelected}>
      <Box width="100%" display="flex" justifyContent="flex-end">
        {authState.role === "normal" ? (
          <IconButton component={ReachLink} to={`/applications/borrow/create`}>
            <AddIcon></AddIcon>
          </IconButton>
        ) : null}
      </Box>
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
