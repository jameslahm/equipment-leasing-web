const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "https://equipment-leasing-server.herokuapp.com"
    : "https://equipment-leasing-server.herokuapp.com";

class HTTPError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const CONTENT_TYPE_JSON = "application/json";

const handleRes = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    throw new HTTPError(data.message, res.status);
  } else {
    return data;
  }
};

export const login = (data) => {
  return fetch(`${BASE_URL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": CONTENT_TYPE_JSON,
    },
    body: JSON.stringify(data),
  }).then(handleRes);
};

export const register = (data) => {
  return fetch(`${BASE_URL}/api/register`, {
    method: "POST",
    headers: {
      "Content-Type": CONTENT_TYPE_JSON,
    },
    body: JSON.stringify(data),
  }).then(handleRes);
};

export const confirmUser = (confirmToken) => {
  return fetch(`${BASE_URL}/api/users/confirm`, {
    method: "POST",
    headers: {
      Authorization: confirmToken,
    },
  }).then(handleRes);
};

export const getAllUsers = (options, token) => {
  const queryParams = new URLSearchParams(options);
  return fetch(`${BASE_URL}/api/users?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  }).then(handleRes);
};

export const getUser = (id, token) => {
  return fetch(`${BASE_URL}/api/users/${id}`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  }).then(handleRes);
};

export const updateUser = ({ data, token, id }) => {
  return fetch(`${BASE_URL}/api/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": CONTENT_TYPE_JSON,
      Authorization: token,
    },
    body: JSON.stringify(data),
  }).then(handleRes);
};

export const deleteUser = ({ token, id }) => {
  return fetch(`${BASE_URL}/api/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token,
    },
  }).then(handleRes);
};

export const getAllEquipments = (options, token) => {
  const queryParams = new URLSearchParams(options);
  return fetch(`${BASE_URL}/api/equipments?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  }).then(handleRes);
};

export const getEquipment = (id, token) => {
  return fetch(`${BASE_URL}/api/equipments/${id}`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  }).then(handleRes);
};

export const updateEquipment = ({ data, token, id }) => {
  return fetch(`${BASE_URL}/api/equipments/${id}`, {
    method: "PUT",
    headers: {
      Authorization: token,
      "Content-Type": CONTENT_TYPE_JSON,
    },
    body: JSON.stringify(data),
  }).then(handleRes);
};

export const deleteEquipment = ({ token, id }) => {
  return fetch(`${BASE_URL}/api/equipments/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token,
    },
  }).then(handleRes);
};

export const createLenderApplication = ({ data, token }) => {
  return fetch(`${BASE_URL}/api/applications/lender`, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": CONTENT_TYPE_JSON,
    },
    body: JSON.stringify(data),
  }).then(handleRes);
};

export const getAllLenderApplications = (options, token) => {
  const queryParams = new URLSearchParams(options);
  return fetch(
    `${BASE_URL}/api/applications/lender?${queryParams.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: token,
      },
    }
  ).then(handleRes);
};

export const getLenderApplication = (id, token) => {
  return fetch(`${BASE_URL}/api/applications/lender/${id}`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  }).then(handleRes);
};

export const updateLenderApplication = ({ data, token, id }) => {
  return fetch(`${BASE_URL}/api/applications/lender/${id}`, {
    method: "PUT",
    headers: {
      Authorization: token,
      "Content-Type": CONTENT_TYPE_JSON,
    },
    body: JSON.stringify(data),
  }).then(handleRes);
};

export const deleteLenderApplication = ({ id, token }) => {
  return fetch(`${BASE_URL}/api/applications/lender/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token,
    },
  }).then(handleRes);
};

export const createPutOnApplication = ({ data, token }) => {
  return fetch(`${BASE_URL}/api/applications/puton`, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": CONTENT_TYPE_JSON,
    },
    body: JSON.stringify(data),
  }).then(handleRes);
};

export const getAllPutOnApplications = (options, token) => {
  const queryParams = new URLSearchParams(options);
  return fetch(`${BASE_URL}/api/applications/puton?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  }).then(handleRes);
};

export const getPutOnApplication = (id, token) => {
  return fetch(`${BASE_URL}/api/applications/puton/${id}`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  }).then(handleRes);
};

export const updatePutOnApplication = ({ data, token, id }) => {
  return fetch(`${BASE_URL}/api/applications/puton/${id}`, {
    method: "PUT",
    headers: {
      Authorization: token,
      "Content-Type": CONTENT_TYPE_JSON,
    },
    body: JSON.stringify(data),
  }).then(handleRes);
};

export const deletePutOnApplication = ({ id, token }) => {
  return fetch(`${BASE_URL}/api/applications/puton/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token,
    },
  }).then(handleRes);
};

export const createBorrowApplication = ({ data, token }) => {
  return fetch(`${BASE_URL}/api/applications/borrow`, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": CONTENT_TYPE_JSON,
    },
    body: JSON.stringify(data),
  }).then(handleRes);
};

export const getAllBorrowApplications = (options, token) => {
  const queryParams = new URLSearchParams(options);
  return fetch(
    `${BASE_URL}/api/applications/borrow?${queryParams.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: token,
      },
    }
  ).then(handleRes);
};

export const getBorrowApplication = (id, token) => {
  return fetch(`${BASE_URL}/api/applications/borrow/${id}`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  }).then(handleRes);
};

export const updateBorrowApplication = ({ data, token, id }) => {
  return fetch(`${BASE_URL}/api/applications/borrow/${id}`, {
    method: "PUT",
    headers: {
      Authorization: token,
      "Content-Type": CONTENT_TYPE_JSON,
    },
    body: JSON.stringify(data),
  }).then(handleRes);
};

export const deleteBorrowApplication = ({ id, token }) => {
  return fetch(`${BASE_URL}/api/applications/borrow/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token,
    },
  }).then(handleRes);
};

export const getAllNotifications = (options, token) => {
  const queryParams = new URLSearchParams(options);
  return fetch(`${BASE_URL}/api/notifications?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  }).then(handleRes);
};

export const getNotification = (id, token) => {
  return fetch(`${BASE_URL}/api/notifications/${id}`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  }).then(handleRes);
};

export const updateNotification = ({ data, token, id }) => {
  return fetch(`${BASE_URL}/api/notifications/${id}`, {
    method: "PUT",
    headers: {
      Authorization: token,
      "Content-Type": CONTENT_TYPE_JSON,
    },
    body: JSON.stringify(data),
  }).then(handleRes);
};

export const deleteNotification = ({ id, token }) => {
  return fetch(`${BASE_URL}/api/notifications/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token,
    },
  }).then(handleRes);
};

export const getStatData = (token) => {
  return fetch(`${BASE_URL}/api/stat`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  }).then(handleRes);
};
