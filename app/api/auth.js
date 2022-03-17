import client from "./client";

const login = (identifier, password) =>
  client.post("/auth/local", { identifier, password });

export default {
  login,
};
