import client from "./client";

const register = (userInfo) => client.post("/auth/local/register", userInfo);

export default { register };
