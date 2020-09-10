import React, { useContext } from "react";
import {
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
  TableSortLabel,
  makeStyles,
} from "@material-ui/core";
import { AuthContext } from "utils";

const useStyles = makeStyles((theme) => ({
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

function EnhancedTableHead({
  onSelectAllClick,
  order,
  orderBy,
  numSelected,
  rowCount,
  onRequestSort,
  headCells,
  resource,
}) {
  const classes = useStyles();
  const { authState } = useContext(AuthContext);

  let showCheckBox = false;
  if (authState.role === "admin") {
    showCheckBox = true;
  }
  if (resource === "equipments" && authState.role === "lender") {
    showCheckBox = true;
  }
  if (resource === "notifications") {
    showCheckBox = true;
  }

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          {!showCheckBox ? null : (
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{ "aria-label": "select all" }}
            />
          )}
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.th ? "left" : "right"}
            padding={headCell.th ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.sortable ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={(e) => {
                  if (headCell.sortable) {
                    onRequestSort(e, headCell.id);
                  }
                }}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </span>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default EnhancedTableHead;
