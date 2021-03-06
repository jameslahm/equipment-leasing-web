import React from "react";
import { getAllNotifications, deleteNotification,formatDate } from "utils";
import { Link as ReachLink } from "@reach/router";
import {
  TableCell,
  TableRow,
  Checkbox,
  IconButton,
  Badge,
  makeStyles,
  Link,
} from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import DeleteIcon from "@material-ui/icons/Delete";
import EnhancedTable, { TableRowSkeleton } from "components/EnhancedTable";
import { StatusHint } from "components/Widget";

const headCells = [
  { id: "id", th: true, label: "ID",sortable:true },
  { id: "sender", label: "Sender" },
  { id: "notification_time", sortable: true, label: "NotificationTime" },
  { id: "result", label: "Result" },
  {
    id: "type",
    label: "Type",
  },
  {
    id: "actions",
    label: "Actions",
  },
];

const useStyles = makeStyles(() => ({
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
          <Badge color="secondary" variant="dot" invisible={row.isRead}>
            {row.id}
          </Badge>
        </TableCell>
        <TableCell className={classes.tableCell}>
          <Link component={ReachLink} to={`/users/${row.sender.id}`}>
            {row.sender.username}
          </Link>
        </TableCell>
        <TableCell className={classes.tableCell}>
          {formatDate(row.notification_time)}
        </TableCell>
        <TableCell className={classes.tableCell}>
          <StatusHint color result={row.result}></StatusHint>
        </TableCell>
        <TableCell className={classes.tableCell}>
          <Link
            component={ReachLink}
            to={`/applications/${row.type}/${row.application_id}`}
          >
            {row.type}
          </Link>
        </TableCell>
        <TableCell className={classes.tableCell}>
          <IconButton component={ReachLink} to={`/notifications/${row.id}`}>
            <VisibilityIcon></VisibilityIcon>
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
