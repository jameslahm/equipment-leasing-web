import React, { useContext, useState } from "react";
import { getAllEquipments, deleteEquipment, canEdit, AuthContext } from "utils";
import { Link as ReachLink } from "@reach/router";
import {
  TableCell,
  TableRow,
  Checkbox,
  IconButton,
  Link,
  makeStyles,
  Box,
  MenuItem,
} from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import EnhancedTable, {
  TableRowSkeleton,
  EnhancedTableToolbar,
} from "components/EnhancedTable";
import FilterListIcon from "@material-ui/icons/FilterList";
import { TextField, ConfirmHint } from "components/Widget";

const useStyles = makeStyles((theme) => ({
  tableCell: {
    textAlign: "right",
  },
  capitalize: {
    textTransform: "capitalize",
  },
}));
const headCells = [
  { id: "id", th: true, disablePadding: true, label: "ID" },
  { id: "name", th: false, disablePadding: false, label: "Name" },
  { id: "owner", th: false, disablePadding: false, label: "Owner" },
  { id: "status", th: false, disablePadding: false, label: "Status" },
  {
    id: "current_application",
    th: false,
    disablePadding: false,
    label: "CurrentApplication",
  },
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
          <Checkbox
            checked={isItemSelected}
            inputProps={{ "aria-labelledby": labelId }}
            onClick={(event) => onClick(event, row.id)}
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
        <TableCell className={classes.tableCell}>
          {row.status.toUpperCase()}
        </TableCell>
        <TableCell className={classes.tableCell}>
          <Link
            component={ReachLink}
            to={`/applications/borrow/${row.current_application.id}`}
          >
            {row.current_application.id}
          </Link>
        </TableCell>
        <TableCell className={classes.tableCell}>
          <ConfirmHint result={row.confirmed_back}></ConfirmHint>
        </TableCell>
        <TableCell className={classes.tableCell}>
          <IconButton
            component={ReachLink}
            to={`/equipments/${row.id}`}
            state={{ status: "IDLE" }}
          >
            <VisibilityIcon></VisibilityIcon>
          </IconButton>
          {canEdit(authState, { id: row.owner.id }) ? (
            <IconButton
              component={ReachLink}
              to={`/equipments/${row.id}`}
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

const useToolbarStyles = makeStyles((theme) => ({
  input: {
    maxWidth: "300px",
    marginRight: theme.spacing(2),
  },
}));

function TableToolbar({ numSelected, onFilter, onDeleteAll }) {
  const classes = useToolbarStyles();
  // const { authState } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");

  const handleClick = () => {
    onFilter({ name: name });
  };

  return (
    <EnhancedTableToolbar numSelected={numSelected} onDeleteAll={onDeleteAll}>
      <Box
        width="100%"
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
      >
        <TextField
          size="small"
          className={classes.input}
          label="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        ></TextField>
        <TextField
          size="small"
          select
          className={classes.input}
          label="status"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
          }}
        >
          <MenuItem key="idle" value="idle">
            IDLE
          </MenuItem>
          <MenuItem key="unreviewed" value="unreviewed">
            Not PutOn
          </MenuItem>
          <MenuItem key="lease" value="lease">
            Lease
          </MenuItem>
        </TextField>
        <IconButton onClick={handleClick}>
          <FilterListIcon></FilterListIcon>
        </IconButton>
      </Box>
    </EnhancedTableToolbar>
  );
}

function EquipmentList() {
  return (
    <EnhancedTable
      headCells={headCells}
      resource="equipments"
      getAllResource={getAllEquipments}
      deleteResource={deleteEquipment}
      RowData={RowData}
      TableToolbar={TableToolbar}
    ></EnhancedTable>
  );
}

export default EquipmentList;
