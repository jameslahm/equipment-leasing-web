import React, { useState } from "react";
import { CssBaseline, IconButton } from "@material-ui/core";
import { Router } from "@reach/router";
import Login from "./components/Login";
import Home from "./components/Home";
import ApplicationList from "./components/ApplicationList";
import NotificationList from "./components/NotificationList";
import UserList from "./components/UserList";
import EquipmentList from "./components/EquipmentList";
import Dashboard from "./components/Dashboard";
import Register from "./components/Register";
import { AuthContext } from "./utils";
import { ReactQueryDevtools } from "react-query-devtools";
import { SnackbarProvider } from "notistack";
import CloseIcon from "@material-ui/icons/Close";
import UserDetail from "./components/UserDetail";
import EquipmentDetail from "./components/EquipmentDetail";

if (process.env.NODE_ENV === "development") {
  const { worker } = require("./utils");
  worker.start();
}

function App() {
  const [authState, setAuthState] = useState(
    JSON.parse(localStorage.getItem("auth"))
  );

  const notistackRef = React.createRef();
  const onClose = (key) => () => {
    notistackRef.current.closeSnackbar(key);
  };

  function setAuthStateAndSave(auth) {
    localStorage.setItem("auth", JSON.stringify(auth));
    setAuthState(auth);
  }

  return (
    <AuthContext.Provider value={{ authState, setAuthStateAndSave }}>
      <SnackbarProvider
        autoHideDuration={2000}
        ref={notistackRef}
        anchorOrigin={{ horizontal: "center", vertical: "top" }}
        action={(key) => (
          <IconButton onClick={onClose(key)}>
            <CloseIcon></CloseIcon>
          </IconButton>
        )}
      >
        <ReactQueryDevtools initialIsOpen={false}></ReactQueryDevtools>
        <CssBaseline></CssBaseline>
        <Router>
          <Login path="/login"></Login>
          <Register path="/register"></Register>
          <Home path="/">
            <Dashboard path="dashboard"></Dashboard>
            <ApplicationList path="applications"></ApplicationList>
            <NotificationList path="notifications"></NotificationList>
            <UserList path="users"></UserList>
            <UserDetail path="users/:id"></UserDetail>
            <EquipmentList path="equipments"></EquipmentList>
            <EquipmentDetail path="equipments/:id"></EquipmentDetail>
          </Home>
        </Router>
      </SnackbarProvider>
    </AuthContext.Provider>
  );
}

export default App;
