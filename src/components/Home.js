import React, { useContext } from "react";
import clsx from "clsx";
import {
  makeStyles,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  IconButton,
  Container,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
} from "@material-ui/core";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MenuIcon from "@material-ui/icons/Menu";
import PeopleIcon from "@material-ui/icons/People";
import DashboardIcon from "@material-ui/icons/Dashboard";
import AssignmentIcon from "@material-ui/icons/Assignment";
import BuildIcon from "@material-ui/icons/Build";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { useLocation, Link as ReachLink, Redirect } from "@reach/router";
import Footer from "./Footer";
import { AuthContext } from "../utils";

const drawerWidth = 240;

const Link = React.forwardRef((props, ref) => {
  return <Button component={ReachLink} {...props} ref={ref}></Button>;
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
}));

const TitleMap = {
  "": "Dashboard",
  "users": "Users",
  "equipments": "Equipments",
  "applications": "Applications",
  "notifications": "Notifications",
};

function Home({ children }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const location = useLocation();
  const title = TitleMap[location.pathname.split("/")[1] || ""];

  const { authState } = useContext(AuthContext);

  if (!authState) {
    return (
      <Redirect
        to="/login"
        noThrow
        state={{ from: location.pathname }}
      ></Redirect>
    );
  }

  return (
    <div className={classes.root}>
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            {title}
          </Typography>
          <IconButton color="inherit" component={ReachLink} to="/profile">
            <AccountCircle></AccountCircle>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <List>
          <ListItem component={Link} to="/">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          {authState.role === "admin" ? (
            <ListItem component={Link} to="/users">
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Users" />
            </ListItem>
          ) : null}
          <ListItem component={Link} to="/equipments">
            <ListItemIcon>
              <BuildIcon />
            </ListItemIcon>
            <ListItemText primary="Equipments" />
          </ListItem>
          <ListItem component={Link} to="/applications">
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Applications" />
          </ListItem>
          <ListItem component={Link} to="/notifications">
            <ListItemIcon>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText primary="Notifications" />
          </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          {authState.confirmed ? (
            children
          ) : (
            <Typography variant="body2" color="secondary">
              Please check your email and activate your account
            </Typography>
          )}
          <Footer></Footer>
        </Container>
      </main>
    </div>
  );
}

export default Home;
