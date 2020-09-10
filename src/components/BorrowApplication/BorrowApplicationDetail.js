import React from "react";
import { getBorrowApplication, updateBorrowApplication } from "utils";
import {
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Link,
} from "@material-ui/core";
import { ApplicationDetail } from "components/Application";
import RoomIcon from "@material-ui/icons/Room";
import PersonIcon from "@material-ui/icons/Person";
import { Link as ReachLink } from "@reach/router";
import BuildIcon from "@material-ui/icons/Build";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 0,
  },
}));

const ResourceDetail = ({ data }) => {
  const classes = useStyles();
  return (
    <CardContent className={classes.root}>
      <CardContent className={classes.root}>
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
              primary={data.reviewer.lab_name}
              secondary={data.reviewer.lab_location}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <BuildIcon></BuildIcon>
            </ListItemIcon>
            <ListItemText
              primary={
                <Link
                  component={ReachLink}
                  to={`/equipments/${data.equipment.id}`}
                >
                  {data.equipment.name}
                </Link>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <LibraryBooksIcon></LibraryBooksIcon>
            </ListItemIcon>
            <ListItemText primary={data.usage} />
          </ListItem>
        </List>
      </CardContent>
    </CardContent>
  );
};

function BorrowApplicationDetail() {
  return (
    <ApplicationDetail
      resource="borrow"
      getResource={getBorrowApplication}
      updateResource={updateBorrowApplication}
      ResourceDetail={ResourceDetail}
    ></ApplicationDetail>
  );
}

export default BorrowApplicationDetail;
