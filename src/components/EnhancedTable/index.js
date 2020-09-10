import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Paper,
  FormControlLabel,
  Switch,
} from "@material-ui/core";
import EnhancedTableHead from "./EnhancedTableHead";
import { useQuery, useMutation, queryCache } from "react-query";
import { AuthContext } from "utils";
import { useSnackbar } from "notistack";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import TableRowSkeleton from "./TableRowSkeleton";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
}));

function EnhancedTable({
  headCells,
  resource,
  getAllResource,
  deleteResource,
  RowData,
  TableToolbar = EnhancedTableToolbar,
}) {
  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [options, setOptions] = useState({});
  const [orderBy, setOrderBy] = useState(headCells[0].id);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { authState } = useContext(AuthContext);

  const { enqueueSnackbar } = useSnackbar();

  const queryKey = [
    resource,
    {
      page,
      page_size: rowsPerPage,
      order,
      orderBy,
      ...options,
    },
    authState.token,
  ];
  const { data = {}, isLoading } = useQuery(queryKey, (key, options, token) =>
    getAllResource(options, token)
  );

  const [mutate] = useMutation(deleteResource);

  // here we use fake rows
  console.log(data, resource);
  const rows = data[resource] || Array(rowsPerPage).fill(undefined);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - rows.length;

  const handleDelete = async (...ids) => {
    try {
      await Promise.all(
        ids.map((id) =>
          mutate({ id, token: authState.token }, { throwOnError: true })
        )
      );
      enqueueSnackbar("Delete Success", {
        variant: "success",
      });
      queryCache.invalidateQueries(queryKey);
    } catch (e) {
      enqueueSnackbar("Delete Fail", {
        variant: "error",
      });
    }
  };

  const handleFilter = (options) => {
    setOptions(options);
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableToolbar
          numSelected={selected.length}
          onFilter={handleFilter}
          onDeleteAll={(e) => {
            handleDelete(...selected);
          }}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              headCells={headCells}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {rows.map((row, index) => {
                console.log(row, isLoading);

                if (isLoading) {
                  return <RowData key={index} isLoading={true}></RowData>;
                }

                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <RowData
                    row={row}
                    key={row.id}
                    isItemSelected={isItemSelected}
                    labelId={labelId}
                    isLoading={isLoading}
                    onDelete={handleDelete}
                    onClick={handleClick}
                  ></RowData>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.total | rowsPerPage}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </div>
  );
}

export default EnhancedTable;
export { EnhancedTableHead, EnhancedTableToolbar, TableRowSkeleton };
