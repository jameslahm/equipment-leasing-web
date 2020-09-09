import React from "react";
import { Tab, makeStyles,Box } from "@material-ui/core";
import { TabPanel, TabContext, TabList } from "@material-ui/lab";
import LenderApplicationList from "./LenderApplicationList";
import PutOnApplicationList from "./PutOnApplicationList";
import BorrowApplicationList from "./BorrowApplicationList";

const useStyles = makeStyles((theme) => ({
  panel: {
    padding: 0,
  },
}));

function ApplicationList() {
  const classes = useStyles();
  const [tabValue, setTabValue] = React.useState("1");

  const handleTabValueChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box >
      <TabContext value={tabValue}>
        <TabList
          onChange={handleTabValueChange}
          aria-label="simple tabs example"
        >
          <Tab label="Lender" value="1" />
          <Tab label="EquipmentPutOn" value="2" />
          <Tab label="EquipmentBorrow" value="3" />
        </TabList>
        <TabPanel value="1" className={classes.panel}>
          <LenderApplicationList></LenderApplicationList>
        </TabPanel>
        <TabPanel value="2" className={classes.panel}>
          <PutOnApplicationList></PutOnApplicationList>
        </TabPanel>
        <TabPanel value="3" className={classes.panel}>
          <BorrowApplicationList></BorrowApplicationList>
        </TabPanel>
      </TabContext>
    </Box>
  );
}

export default ApplicationList;
