import React from "react";
import { getAllEquipments, deleteEquipment } from "../utils";
import EnhancedTable from "./EnhancedTable";
import { Link as ReachLink } from "@reach/router";
import {
  TableCell,
  TableRow,
  Checkbox,
  IconButton,
  Link,
  makeStyles,
} from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import TableRowSkeleton from "./EnhancedTable/TableRowSkeleton";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";

const useStyles = makeStyles((theme) => ({
  tableCell: {
    textAlign: "right",
  },
  capitalize: {
    textTransform: "capitalize",
  },
  success: {
    color: theme.palette.success.main,
  },
  error: {
    color: theme.palette.error.main,
  },
}));
const headCells = [
  { id: "id", th: true, disablePadding: true, label: "ID" },
  { id: "name", th: false, disablePadding: false, label: "Name" },
  { id: "owner", th: false, disablePadding: false, label: "Owner" },
  { id: "status", th: false, disablePadding: false, label: "Status" },
  {
    id: "confirmed_back",
    th: false,
    disablePadding: false,
    label: "ConfirmedBack",
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
            onClick={(event) => onClick(event, row.name)}
          />
        </TableCell>
        <TableCell component="th" id={labelId} scope="row" padding="none">
          {row.id}
        </TableCell>
        <TableCell className={classes.tableCell}>{row.name}</TableCell>
        <TableCell className={classes.tableCell}>
          <Link component={ReachLink} to={`/users/${row.owner.id}`}>
            {row.owner.username}
          </Link>
        </TableCell>
        <TableCell className={classes.tableCell}>{row.status.toUpperCase()}</TableCell>
        <TableCell className={classes.tableCell}>
          {row.confirmed_back ? (
            <CheckCircleOutlineIcon
              className={classes.success}
            ></CheckCircleOutlineIcon>
          ) : (
            <ErrorOutlineIcon className={classes.error}></ErrorOutlineIcon>
          )}
        </TableCell>
        <TableCell className={classes.tableCell}>
          <IconButton
            component={ReachLink}
            to={`/equipments/${row.id}`}
            state={{ status: "IDLE" }}
          >
            <VisibilityIcon></VisibilityIcon>
          </IconButton>
          <IconButton
            component={ReachLink}
            to={`/equipments/${row.id}`}
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
    return <TableRowSkeleton columns={6}></TableRowSkeleton>;
  }
}

function EquipmentList() {
  return (
    <EnhancedTable
      headCells={headCells}
      resource="equipments"
      getAllResource={getAllEquipments}
      deleteResource={deleteEquipment}
      RowData={RowData}
    ></EnhancedTable>
  );
}

export default EquipmentList;
