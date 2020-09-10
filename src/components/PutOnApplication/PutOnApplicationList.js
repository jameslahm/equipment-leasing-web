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
  getAllPutOnApplications,
  deletePutOnApplication,
  AuthContext,
  formatDate
} from "utils";
import { Link as ReachLink } from "@reach/router";
import { StatusHint } from "components/Widget";
import EnhancedTable, {
  EnhancedTableToolbar,
  TableRowSkeleton,
} from "components/EnhancedTable";
import AddIcon from "@material-ui/icons/Add";

const headCells = [
  { id: "id", th: true, label: "ID", sortable: true },
  { id: "candidate", label: "Candidate" },
  { id: "application_time", label: "ApplicationTime", sortable: true },
  {
    id: "status",
    label: "Status",
  },
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
          {formatDate(row.application_time)}
        </TableCell>
        <TableCell className={classes.tableCell}>
          <StatusHint color result={row.status}></StatusHint>
        </TableCell>
        <TableCell className={classes.tableCell}>
          <IconButton
            component={ReachLink}
            to={`/applications/puton/${row.id}`}
            state={{ status: "IDLE" }}
          >
            <VisibilityIcon></VisibilityIcon>
          </IconButton>
          {row.status === "unreviewed" ? (
            <IconButton
              component={ReachLink}
              to={`/applications/puton/${row.id}`}
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

function TableToolbar({ numSelected, onFilter, onDeleteAll }) {
  const { authState } = useContext(AuthContext);
  return (
    <EnhancedTableToolbar numSelected={numSelected} onDeleteAll={onDeleteAll}>
      <Box width="100%" display="flex" justifyContent="flex-end">
        {authState.role === "lender" ? (
          <IconButton component={ReachLink} to={`/applications/puton/create`}>
            <AddIcon></AddIcon>
          </IconButton>
        ) : null}
      </Box>
    </EnhancedTableToolbar>
  );
}

function PutOnApplicationList() {
  return (
    <EnhancedTable
      headCells={headCells}
      resource="equipment_puton_applications"
      getAllResource={getAllPutOnApplications}
      deleteResource={deletePutOnApplication}
      RowData={RowData}
      TableToolbar={TableToolbar}
    ></EnhancedTable>
  );
}

export default PutOnApplicationList;
