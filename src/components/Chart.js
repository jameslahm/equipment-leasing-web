import React, { useContext } from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Label,
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell,
  BarChart,
} from "recharts";
import {
  useTheme,
  Grid,
  Typography,
  makeStyles,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
} from "@material-ui/core";
import { AuthContext, generateMessage, getStatData } from "utils";
import { useQuery } from "react-query";
import { Skeleton } from "@material-ui/lab";
import { useSnackbar } from "notistack";
import { navigate } from "@reach/router";

const Title = (props) => (
  <Typography
    component="h2"
    variant="h6"
    color="primary"
    gutterBottom
    {...props}
  ></Typography>
);

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="rgba(0, 0, 0, 0.87)"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const useStyles = makeStyles((theme) => ({
  title: {
    marginTop: theme.spacing(4),
  },
  list: {
    marginTop: theme.spacing(4),
  },
}));

export default function Chart() {
  const theme = useTheme();
  const classes = useStyles();
  const COLORS = [
    theme.palette.primary.light,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.info.main,
  ];

  const { authState,setAuthStateAndSave } = useContext(AuthContext);

  const { enqueueSnackbar } = useSnackbar();

  const { data = {}, isLoading, isError } = useQuery(
    ["stat", authState.token],
    (key, token) => getStatData(token),
    {
      retry: false,
      onError: (e) => {
        enqueueSnackbar(generateMessage(e), {
          variant: "error",
        });
        setAuthStateAndSave(null)
        if (e.status === 401) {
          navigate("/login");
        }
      },
    }
  );

  if (isLoading || isError) {
    return <Skeleton variant="rect" height="400px"></Skeleton>;
  }

  const borrowLogData = data.borrow_log.map((v, i) => ({
    time: i,
    number: v,
  }));

  const confirmUsers = [
    { name: "Confirmed Users", value: data.confirmed_users },
    { name: "UnConfirmed Users", value: data.unconfirmed_users },
  ];

  const roleUsers = [
    { name: "Normal Users", value: data.normal_users },
    { name: "Lender Users", value: data.lender_users },
  ];

  const equipmentsData = [
    { status: "idle", value: data.idle_equipments },
    { status: "lease", value: data.lease_equipments },
    { status: "unreviewed", value: data.unreviewed_equipments },
  ];

  return (
    <Grid container>
      <Grid item md={6}>
        <Title>Last Week Borrow Equipments</Title>
        <ResponsiveContainer width="70%" height={400}>
          <ComposedChart
            width={500}
            height={400}
            data={borrowLogData}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            {/* <CartesianGrid stroke="#f5f5f5" /> */}
            <XAxis dataKey="time" stroke={theme.palette.text.secondary}>
              <Label position="bottom">Time</Label>
            </XAxis>
            <YAxis stroke={theme.palette.text.secondary}>
              <Label
                angle={270}
                position="left"
                style={{ textAnchor: "middle" }}
              >
                Borrow Equipments
              </Label>
            </YAxis>
            <Tooltip />
            {/* <Legend /> */}
            <Bar
              dataKey="number"
              barSize={20}
              fill={theme.palette.primary.main}
            />
            <Line
              type="monotone"
              dataKey="number"
              stroke={theme.palette.secondary.main}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Grid>
      <Grid item md={6}>
        <List
          className={classes.list}
          subheader={
            <ListSubheader component="div">Recent Applications</ListSubheader>
          }
        >
          <ListItem button>
            <ListItemText>
              Lender Applications: {data.lender_applications}
            </ListItemText>
          </ListItem>
          <ListItem button>
            <ListItemText>
              PutOn Applications: {data.equipment_puton_applications}
            </ListItemText>
          </ListItem>
          <ListItem button>
            <ListItemText>
              Borrow Applications: {data.equipment_borrow_applications}
            </ListItemText>
          </ListItem>
        </List>
      </Grid>
      <Grid item md={6}>
        <Title className={classes.title}>Equipments Status Distribution</Title>
        <ResponsiveContainer width="60%" height={300}>
          <BarChart
            data={equipmentsData}
            margin={{
              top: 40,
              right: 20,
              left: 20,
              bottom: 20,
            }}
            barCategoryGap={"40%"}
          >
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill={theme.palette.primary.main} />
          </BarChart>
        </ResponsiveContainer>
      </Grid>
      <Grid item md={6}>
        <Title>Users Distribution</Title>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Legend></Legend>
            <Tooltip></Tooltip>
            <Pie
              data={confirmUsers}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={40}
              label={renderCustomizedLabel}
              labelLine={false}
            >
              {confirmUsers.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]}></Cell>
              ))}
            </Pie>
            <Pie
              data={roleUsers}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              label={renderCustomizedLabel}
              labelLine={false}
            >
              {roleUsers.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[(index + 2) % COLORS.length]}
                ></Cell>
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </Grid>
    </Grid>
  );
}
