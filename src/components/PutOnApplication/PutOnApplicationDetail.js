import React from "react";
import { getPutOnApplication, updatePutOnApplication } from "utils";
import {
  List,
  ListItemIcon,
  ListItemText,
  ListItem,
  Link,
} from "@material-ui/core";
import { ApplicationDetail } from "components/Application";
import PersonIcon from "@material-ui/icons/Person";
import BuildIcon from "@material-ui/icons/Build";
import { Link as ReachLink } from "@reach/router";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import RoomIcon from "@material-ui/icons/Room";

const ResourceDetail = ({ data }) => {
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
        <ListItemText
          primary={data.candidate.lab_name}
          secondary={data.candidate.lab_location}
        />
      </ListItem>
      <ListItem>
        <ListItemIcon>
          <BuildIcon></BuildIcon>
        </ListItemIcon>
        <ListItemText
          primary={
            <Link component={ReachLink} to={`/equipments/${data.equipment.id}`}>
              {data.equipment.name}
            </Link>
          }
        />
      </ListItem>
      <ListItem>
        <ListItemIcon>
          <LibraryBooksIcon></LibraryBooksIcon>
        </ListItemIcon>
        <ListItemText primary={data.equipment.usage} />
      </ListItem>
    </List>
  );
};

function BorrowApplicationDetail() {
  return (
    <ApplicationDetail
      resource="puton"
      getResource={getPutOnApplication}
      updateResource={updatePutOnApplication}
      ResourceDetail={ResourceDetail}
    ></ApplicationDetail>
  );
}

export default BorrowApplicationDetail;
