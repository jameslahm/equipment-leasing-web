import React from "react";
import { ApplicationDetail } from "components/Application";
import {
  CardContent,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import { updateLenderApplication, getLenderApplication } from "utils";
import { Link as ReachLink } from "@reach/router";
// import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import RoomIcon from "@material-ui/icons/Room";
import PersonIcon from "@material-ui/icons/Person";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 0,
  },
}));

const ResourceDetail = ({ data }) => {
  const classes = useStyles();
  return (
    <List>
      <ListItem>
        <ListItemIcon>
          <PersonIcon></PersonIcon>
        </ListItemIcon>
        <ListItemText
          primary={
            <Link component={ReachLink} to={`/users/${data.candidate.id}`}>
              {data.candidate.username}
            </Link>
          }
        />
      </ListItem>
      <ListItem>
        <ListItemIcon>
          <RoomIcon></RoomIcon>
        </ListItemIcon>
        <ListItemText primary={data.lab_name} secondary={data.lab_location} />
      </ListItem>
      {/* <ListItem>
          <ListItemIcon>
            <LibraryBooksIcon></LibraryBooksIcon>
          </ListItemIcon>
          <ListItemText primary={data.usage} />
        </ListItem> */}
    </List>
  );
};

function LenderApplicationDetail() {
  return (
    <ApplicationDetail
      resource="lender"
      getResource={getLenderApplication}
      updateResource={updateLenderApplication}
      ResourceDetail={ResourceDetail}
    ></ApplicationDetail>
  );
}

export default LenderApplicationDetail;
