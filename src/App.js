import React, { useState } from "react";
import { CssBaseline, IconButton } from "@material-ui/core";
import { Router } from "@reach/router";
import Login from "components/Login";
import Home from "components/Home";
import { ApplicationTabs, ApplicationCreate } from "components/Application";
import { NotificationList, NotificationDetail } from "components/Notification";
import { UserList, UserDetail, UserConfirm } from "components/User";
import { EquipmentList, EquipmentDetail } from "components/Equipment";
import Dashboard from "components/Dashboard";
import Register from "components/Register";
import { AuthContext, ChatContext } from "./utils";
import { ReactQueryDevtools } from "react-query-devtools";
import { SnackbarProvider } from "notistack";
import CloseIcon from "@material-ui/icons/Close";
import { LenderApplicationDetail } from "components/LenderApplication";
import { PutOnApplicationDetail } from "components/PutOnApplication";
import { BorrowApplicationDetail } from "components/BorrowApplication";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Logs from "components/Logs";
import ChatPanel from "components/ChatPanel";

// if (process.env.NODE_ENV === "development") {
//   const { worker } = require("./utils");
//   worker.start();
// }

function App() {
  const [authState, setAuthState] = useState(
    JSON.parse(localStorage.getItem("auth"))
  );

  const [messages, setMessages] = useState(
    JSON.parse(localStorage.getItem("messages"))||{}
  );

  const notistackRef = React.createRef();
  const onClose = (key) => () => {
    notistackRef.current.closeSnackbar(key);
  };

  function setMessagesAndSave(m) {
    localStorage.setItem("messages", JSON.stringify(messages));
    setMessages(m === messages ? { ...m } : m);
  }

  function setAuthStateAndSave(auth) {
    localStorage.setItem("auth", JSON.stringify(auth));
    setAuthState(auth);
  }

  return (
    <ChatContext.Provider value={{ messages, setMessagesAndSave }}>
      <AuthContext.Provider value={{ authState, setAuthStateAndSave }}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
                <Dashboard path="/"></Dashboard>
                <ApplicationTabs path="applications"></ApplicationTabs>
                <ApplicationCreate
                  type="lender"
                  path="applications/lender/create"
                ></ApplicationCreate>
                <ApplicationCreate
                  type="puton"
                  path="applications/puton/create"
                ></ApplicationCreate>
                <ApplicationCreate
                  type="puton"
                  path="applications/puton/create/:id"
                ></ApplicationCreate>
                <ApplicationCreate
                  type="borrow"
                  path="applications/borrow/create/:id"
                ></ApplicationCreate>
                <LenderApplicationDetail path="applications/lender/:id"></LenderApplicationDetail>
                <PutOnApplicationDetail path="applications/puton/:id"></PutOnApplicationDetail>
                <BorrowApplicationDetail path="applications/borrow/:id"></BorrowApplicationDetail>
                <NotificationList path="notifications"></NotificationList>
                <NotificationDetail path="notifications/:id"></NotificationDetail>
                <UserList path="users"></UserList>
                <UserConfirm path="users/confirm"></UserConfirm>
                <UserDetail path="users/:id"></UserDetail>
                <EquipmentList path="equipments"></EquipmentList>
                <EquipmentDetail path="equipments/:id"></EquipmentDetail>
                <Logs path="logs"></Logs>
                <ChatPanel path="chat"></ChatPanel>
                <ChatPanel path="chat/:id"></ChatPanel>
              </Home>
            </Router>
          </SnackbarProvider>
        </MuiPickersUtilsProvider>
      </AuthContext.Provider>
    </ChatContext.Provider>
  );
}

export default App;
