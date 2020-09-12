import { formatDistance } from "date-fns";

export const capitalize = (s) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const canEdit = (authState, user) => {
  if (authState.role === "admin" || authState.id === parseInt(user.id)) {
    return true;
  }
  return false;
};

export const isAdmin = (authState) => {
  return authState && authState.role === "admin";
};

export const formatDate = (d, l) => {
  return formatDistance(new Date(d), new Date()) + (l || " ago");
};
