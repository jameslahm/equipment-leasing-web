import React from "react";
import { Paper, Tab } from "@material-ui/core";
import { TabPanel, TabContext, TabList } from "@material-ui/lab";
import LenderApplicationList from "./LenderApplicationList";
import PutOnApplicationList from "./PutOnApplicationList";
import BorrowApplicationList from "./BorrowApplicationList";

function ApplicationList() {
  const [tabValue, setTabValue] = React.useState("1");

  const handleTabValueChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Paper square>
      <TabContext value={tabValue}>
        <TabList
          onChange={handleTabValueChange}
          aria-label="simple tabs example"
        >
          <Tab label="Lender" value="1" />
          <Tab label="EquipmentPutOn" value="2" />
          <Tab label="EquipmentBorrow" value="3" />
        </TabList>
        <TabPanel value="1">
          <LenderApplicationList></LenderApplicationList>
        </TabPanel>
        <TabPanel value="2">
          <PutOnApplicationList></PutOnApplicationList>
        </TabPanel>
        <TabPanel value="3">
          <BorrowApplicationList></BorrowApplicationList>
        </TabPanel>
      </TabContext>
    </Paper>
  );
}

export default ApplicationList;
