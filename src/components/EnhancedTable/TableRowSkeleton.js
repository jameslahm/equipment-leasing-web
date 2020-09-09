import React from "react";
import { TableCell, TableRow } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

function TableRowSkeleton({ columns }) {
  return (
    <TableRow hover tabIndex={-1}>
      <TableCell padding="checkbox">{/* <Checkbox /> */}</TableCell>
      <TableCell component="th" scope="row" padding="none">
        <Skeleton variant="rect"></Skeleton>
      </TableCell>
      {Array(columns - 1)
        .fill(undefined)
        .map((_,i) => (
          <TableCell key={i}>
            <Skeleton variant="rect"></Skeleton>
          </TableCell>
        ))}
    </TableRow>
  );
}

export default TableRowSkeleton;
