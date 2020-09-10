import { rest, setupWorker } from "msw";

const FAKE_USER_UNCONFIRMED = {
  id: 1,
  email: "fake@example.com",
  confirm_token: "jwt.token.here",
  username: "fake",
  avatar: "http://example.com",
  role: "normal",
  confirmed: false,
};

const FAKE_USER_CONFIRMED = {
  id: 1,
  email: "fake@example.com",
  token: "jwt.token.here",
  username: "fake",
  avatar: "http://example.com",
  role: "normal",
  confirmed: true,
};

const FAKE_USERS = {
  users: [FAKE_USER_CONFIRMED],
  total: 100,
};

const FAKE_EQUIPMENT = {
  id: 1,
  status: "idle",
  return_time: 1599732065964,
  name: "fake",
  usage: "Hello",
  owner: {
    id: 2,
    lab_name: "fake",
    lab_location: "fake",
    email: "fake",
    username: "fake",
  },
  confirmed_back: false,
  current_application: {
    id: 1,
    candidate_id: 2,
  },
};

const FAKE_EQUIPMENTS = {
  equipments: [FAKE_EQUIPMENT],
  total: 1,
};

const FAKE_EQUIPMENT_PUTON_APPLICATION = {
  id: 1,
  status: "unreviewed",
  reviewer: {
    id: 1,
    username: "fake",
    email: "fake",
    avatar: "fake",
  },
  application_time: 1599732065964,
  review_time: 1599732065964,
  candidate: {
    id: 1,
    username: "fake",
    email: "fake",
    avatar: "fake",
    lab_location: "fake",
    lab_name: "fake",
  },
  equipment: {
    id: 1,
    name: "Haaa",
    usage:
      "ashaodcygdshbcifasgdvjsavcalkscnhadyvsdjnkasduasd askdhasjhdoausdhasdbhasnkcasucoaiucbhadkscvsabhdicvak",
  },
};

const FAKE_EQUIPMENT_PUTON_APPLICATIONS = {
  equipment_puton_applications: [FAKE_EQUIPMENT_PUTON_APPLICATION],
  total: 1,
};

const FAKE_EQUIPMENT_BORROW_APPLICATION = {
  id: 1,
  status: "unreviewed",
  reviewer: {
    username: "fake",
    email: "fake",
    lab_name: "fake",
    lab_location: "fake",
    id: 1,
  },
  usage:
    "ashaodcygdshbcifasgdvjsavcalkscnhadyvsdjnkasduasd askdhasjhdoausdhasdbhasnkcasucoaiucbhadkscvsabhdicvak",
  return_time: 1599732065964,
  application_time: 1599732065964,
  review_time: 1599732065964,
  candidate: {
    username: "fake",
    email: "fake",
    avatar: "fake",
    id: 1,
  },
  equipment: {
    id: 1,
    name: "Haaa",
  },
};

const FAKE_EQUIPMENT_BORROW_APPLICATIONS = {
  equipment_borrow_applications: [FAKE_EQUIPMENT_BORROW_APPLICATION],
  total: 1,
};

const FAKE_LENDER_APPLICATION = {
  id: 1,
  status: "agree",
  application_time: 1599732065964,
  lab_name: "fake",
  lab_location: "fake",
  candidate: {
    username: "fake",
    email: "fake",
    avatar: "fake",
    id: 1,
  },
  review_time: 1599732065964,
};

const FAKE_LENDER_APPLICATIONS = {
  lender_applications: [FAKE_LENDER_APPLICATION],
  total: 1,
};

const FAKE_APPLICATION_NOTIFICATION = {
  sender: {
    username: "fake",
    email: "fake",
    avatar: "fake",
    id: 1,
  },
  id: 1,
  content: "fake",
  notification_time: 1599732065964,
  isRead: false,
  application_id: "1",
  type: "lender",
  result: "agree",
};

const FAKE_APPLICATION_NOTIFICATIONS = {
  notifications: [FAKE_APPLICATION_NOTIFICATION],
  total: 1,
};

const handlers = [
  // confirm
  rest.post("/api/users/confirm", (req, res, ctx) => {
    return res(ctx.delay(1000), ctx.status(200), ctx.json(FAKE_USER_CONFIRMED));
  }),

  // login and register
  rest.post("/api/login", (req, res, ctx) => {
    return res(ctx.delay(1000), ctx.status(200), ctx.json(FAKE_USER_CONFIRMED));
  }),

  rest.post("/api/register", (req, res, ctx) => {
    return res(
      ctx.delay(1000),
      ctx.status(200),
      ctx.json(FAKE_USER_UNCONFIRMED)
    );
  }),

  // User
  rest.get("/api/users", (req, res, ctx) => {
    return res(ctx.delay(1000), ctx.status(200), ctx.json(FAKE_USERS));
  }),

  // Here we could use to confirm
  rest.put("/api/users/:id", (req, res, ctx) => {
    return res(ctx.delay(1000), ctx.status(200), ctx.json(FAKE_USER_CONFIRMED));
  }),

  rest.get("/api/users/:id", (req, res, ctx) => {
    return res(ctx.delay(1000), ctx.status(200), ctx.json(FAKE_USER_CONFIRMED));
  }),

  rest.delete("/api/users/:id", (req, res, ctx) => {
    return res(ctx.delay(1000), ctx.status(200), ctx.json(FAKE_USER_CONFIRMED));
  }),

  // Equipment
  rest.get("/api/equipments", (req, res, ctx) => {
    return res(ctx.delay(1000), ctx.status(200), ctx.json(FAKE_EQUIPMENTS));
  }),

  rest.get("/api/equipments/:id", (req, res, ctx) => {
    return res(ctx.delay(1000), ctx.status(200), ctx.json(FAKE_EQUIPMENT));
  }),

  // Here we could use to return back and confirm back
  rest.put("/api/equipments/:id", (req, res, ctx) => {
    return res(ctx.delay(1000), ctx.status(200), ctx.json(FAKE_EQUIPMENT));
  }),

  rest.delete("/api/equipments/:id", (req, res, ctx) => {
    return res(ctx.delay(1000), ctx.status(200), ctx.json(FAKE_EQUIPMENT));
  }),

  // application lender
  rest.post("/api/applications/lender", (req, res, ctx) => {
    return res(
      ctx.delay(1000),
      ctx.status(200),
      ctx.json(FAKE_LENDER_APPLICATION)
    );
  }),

  rest.get("/api/applications/lender", (req, res, ctx) => {
    return res(
      ctx.delay(1000),
      ctx.status(200),
      ctx.json(FAKE_LENDER_APPLICATIONS)
    );
  }),

  rest.get("/api/applications/lender/:id", (req, res, ctx) => {
    return res(
      ctx.delay(1000),
      ctx.status(200),
      ctx.json(FAKE_LENDER_APPLICATION)
    );
  }),

  // Here we could use to agree or refuse the application
  rest.put("/api/applications/lender/:id", (req, res, ctx) => {
    return res(
      ctx.delay(1000),
      ctx.status(200),
      ctx.json(FAKE_LENDER_APPLICATION)
    );
  }),

  rest.delete("/api/applications/lender/:id", (req, res, ctx) => {
    return res(
      ctx.delay(1000),
      ctx.status(200),
      ctx.json(FAKE_LENDER_APPLICATION)
    );
  }),

  // application puton
  rest.post("/api/applications/puton", (req, res, ctx) => {
    return res(
      ctx.delay(1000),
      ctx.status(200),
      ctx.json(FAKE_EQUIPMENT_PUTON_APPLICATION)
    );
  }),

  rest.get("/api/applications/puton", (req, res, ctx) => {
    return res(
      ctx.delay(1000),
      ctx.status(200),
      ctx.json(FAKE_EQUIPMENT_PUTON_APPLICATIONS)
    );
  }),

  rest.get("/api/applications/puton/:id", (req, res, ctx) => {
    return res(
      ctx.delay(1000),
      ctx.status(200),
      ctx.json(FAKE_EQUIPMENT_PUTON_APPLICATION)
    );
  }),

  // Here we could use to agree or refuse the application
  rest.put("/api/applications/puton/:id", (req, res, ctx) => {
    return res(
      ctx.delay(1000),
      ctx.status(200),
      ctx.json(FAKE_EQUIPMENT_PUTON_APPLICATION)
    );
  }),

  rest.delete("/api/applications/puton/:id", (req, res, ctx) => {
    return res(
      ctx.delay(1000),
      ctx.status(200),
      ctx.json(FAKE_EQUIPMENT_PUTON_APPLICATION)
    );
  }),

  // application borrow
  rest.post("/api/applications/borrow", (req, res, ctx) => {
    return res(
      ctx.delay(1000),
      ctx.status(200),
      ctx.json(FAKE_EQUIPMENT_BORROW_APPLICATION)
    );
  }),

  rest.get("/api/applications/borrow", (req, res, ctx) => {
    return res(
      ctx.delay(1000),
      ctx.status(200),
      ctx.json(FAKE_EQUIPMENT_BORROW_APPLICATIONS)
    );
  }),

  rest.get("/api/applications/borrow/:id", (req, res, ctx) => {
    return res(
      ctx.delay(1000),
      ctx.status(200),
      ctx.json(FAKE_EQUIPMENT_BORROW_APPLICATION)
    );
  }),

  // Here we could use to agree or refuse the application
  rest.put("/api/applications/borrow/:id", (req, res, ctx) => {
    return res(
      ctx.delay(1000),
      ctx.status(200),
      ctx.json(FAKE_EQUIPMENT_BORROW_APPLICATION)
    );
  }),

  rest.delete("/api/applications/borrow/:id", (req, res, ctx) => {
    return res(
      ctx.delay(1000),
      ctx.status(200),
      ctx.json(FAKE_EQUIPMENT_BORROW_APPLICATION)
    );
  }),

  // notification
  rest.get("/api/notifications", (req, res, ctx) => {
    return res(
      ctx.delay(1000),
      ctx.status(200),
      ctx.json(FAKE_APPLICATION_NOTIFICATIONS)
    );
  }),

  rest.get("/api/notifications/:id", (req, res, ctx) => {
    return res(
      ctx.delay(1000),
      ctx.status(200),
      ctx.json(FAKE_APPLICATION_NOTIFICATION)
    );
  }),

  // here we could use to change isRead
  rest.put("/api/notifications/:id", (req, res, ctx) => {
    return res(
      ctx.delay(1000),
      ctx.status(200),
      ctx.json(FAKE_APPLICATION_NOTIFICATION)
    );
  }),

  rest.delete("/api/notifications/:id", (req, res, ctx) => {
    return res(
      ctx.delay(1000),
      ctx.status(200),
      ctx.json(FAKE_APPLICATION_NOTIFICATION)
    );
  }),
];

export const worker = setupWorker(...handlers);
