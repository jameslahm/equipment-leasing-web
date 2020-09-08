import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Paper,
  Checkbox,
  FormControlLabel,
  Switch,
  IconButton,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import EnhancedTableHead from "./EnhancedTableHead";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { useQuery, useMutation, queryCache } from "react-query";
import { AuthContext } from "../../utils";
import { Link as ReachLink } from "@reach/router";
import { useSnackbar } from "notistack";

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
}) {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState(headCells[0].id);
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const { authState } = useContext(AuthContext);

  const { enqueueSnackbar } = useSnackbar();

  const queryKey = [
    resource,
    {
      page,
      page_size: rowsPerPage,
      order,
      orderBy,
    },
    authState.token,
  ];
  const { data = {}, isLoading } = useQuery(queryKey, (key, options, token) =>
    getAllResource(options, token)
  );

  const [mutate] = useMutation(deleteResource);

  const rows = data.resource || [];

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
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
        ids.map((id) => mutate({ id, token: authState.token }))
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

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length} />
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
              {rows
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.username}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": labelId }}
                          onClick={(event) => handleClick(event, row.name)}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {isLoading ? (
                          <Skeleton variant="rect"></Skeleton>
                        ) : (
                          row.username
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {isLoading ? (
                          <Skeleton variant="rect"></Skeleton>
                        ) : (
                          row.username
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {isLoading ? (
                          <Skeleton variant="rect"></Skeleton>
                        ) : (
                          row.username
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {isLoading ? (
                          <Skeleton variant="rect"></Skeleton>
                        ) : (
                          row.username
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {isLoading ? (
                          <Skeleton variant="rect"></Skeleton>
                        ) : (
                          <>{row.username}</>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          component={ReachLink}
                          to={`/users/${row.id}`}
                          state={{ status: "IDLE" }}
                        >
                          <VisibilityIcon></VisibilityIcon>
                        </IconButton>
                        <IconButton
                          component={ReachLink}
                          to={`/users/${row.id}`}
                          state={{ status: "EDIT" }}
                        >
                          <EditIcon></EditIcon>
                        </IconButton>
                        <IconButton onClick={(e) => handleDelete(row.id)}>
                          <DeleteIcon></DeleteIcon>
                        </IconButton>
                      </TableCell>
                    </TableRow>
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
          count={rows.length}
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
