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
  Badge,
} from "@material-ui/core";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MenuIcon from "@material-ui/icons/Menu";
import PeopleIcon from "@material-ui/icons/People";
import DashboardIcon from "@material-ui/icons/Dashboard";
import AssignmentIcon from "@material-ui/icons/Assignment";
import BuildIcon from "@material-ui/icons/Build";
import AccountCircle from "@material-ui/icons/AccountCircle";
import {
  useLocation,
  Link as ReachLink,
  Redirect,
  navigate,
} from "@reach/router";
import Footer from "components/Footer";
import {
  AuthContext,
  isAdmin,
  getAllNotifications,
  getUser,
  generateMessage,
  ChatContext,
  getMessages,
} from "utils";
import { useQuery } from "react-query";
import { useSnackbar } from "notistack";
import EventNoteIcon from "@material-ui/icons/EventNote";
import ChatIcon from "@material-ui/icons/Chat";

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
  users: "Users",
  equipments: "Equipments",
  applications: "Applications",
  notifications: "Notifications",
};

function Home({ children }) {
  const classes = useStyles();
  const { authState, setAuthStateAndSave } = useContext(AuthContext);
  const { messages: originalMessages, setMessagesAndSave } = useContext(
    ChatContext
  );

  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const { data: notifications = {} } = useQuery(
    [
      "notifications",
      {
        total: true,
        isRead: false,
      },
      (authState || {}).token,
    ],
    (key, options, token) => getAllNotifications(options, token),
    {
      enabled: authState && authState.token,
      retry: false,
    }
  );

  const { data: messages = { unread_users: [] } } = useQuery(
    ["messages", (authState || {}).token],
    (key, token) => getMessages(token),
    {
      enabled: authState && authState.token,
      retry: false,
      onSuccess: (data) => {
        Object.values(originalMessages).forEach((v) => {
          v.total = 0;
        });
        data.unread_users.forEach((u) => {
          if (u.id in originalMessages) {
            originalMessages[u.id].isRead = false;
            originalMessages[u.id].total = u.total;
          } else {
            originalMessages[u.id] = {
              isRead: false,
              messages: [],
              username: u.username,
              avatar: u.avatar,
              total: u.total,
            };
          }
        });
        setMessagesAndSave(originalMessages);
      },
    }
  );

  const unreadMessagesCount = messages.unread_users
    .map((u) => u.total)
    .reduce((a, b) => a + b, 0);

  const { enqueueSnackbar } = useSnackbar();
  useQuery(
    [
      "user",
      (authState || {}).id,
      authState
        ? authState.token
          ? authState.token
          : authState.confirm_token
        : undefined,
    ],
    (key, id, token) => getUser(id, token),
    {
      retry: false,
      // staleTime: Infinity,
      onSuccess: (data) => {
        setAuthStateAndSave({ ...(authState || {}), ...data });
      },
      enabled: authState && (authState.token || authState.confirm_token),
      onError: (e) => {
        enqueueSnackbar(generateMessage(e), {
          variant: "error",
        });
        if (e.status === 401) {
          setAuthStateAndSave(null);
          navigate("/login");
        }
        if (e.status === 404) {
          navigate("/");
        }
      },
    }
  );

  const location = useLocation();
  const title = TitleMap[location.pathname.split("/")[1] || ""];
  const segements = location.pathname.split("/");
  let isConfirmPath = false;
  if (segements[1] === "users") {
    if (segements[2] === "confirm") {
      isConfirmPath = true;
    }
    if (authState && parseInt(segements[2]) === authState.id) {
      isConfirmPath = true;
    }
  }

  if (!authState && !isConfirmPath) {
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
          {authState && authState.id ? (
            <IconButton
              color="inherit"
              component={ReachLink}
              to={`/users/${authState.id}`}
            >
              <AccountCircle></AccountCircle>
            </IconButton>
          ) : null}
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
          {isAdmin(authState) ? (
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
              <Badge
                badgeContent={notifications.total}
                color="secondary"
                invisible={!notifications.total}
              >
                <NotificationsIcon />
              </Badge>
            </ListItemIcon>
            <ListItemText primary="Notifications" />
          </ListItem>
          <ListItem component={Link} to="/chat">
            <ListItemIcon>
              <Badge
                badgeContent={unreadMessagesCount}
                color="secondary"
                invisible={!unreadMessagesCount}
              >
                <ChatIcon></ChatIcon>
              </Badge>
            </ListItemIcon>
            <ListItemText primary="Chat" />
          </ListItem>
          {isAdmin(authState) ? (
            <ListItem component={Link} to="/logs">
              <ListItemIcon>
                <EventNoteIcon />
              </ListItemIcon>
              <ListItemText primary="Logs" />
            </ListItem>
          ) : null}
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          {(authState && authState.confirmed) || isConfirmPath ? (
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
