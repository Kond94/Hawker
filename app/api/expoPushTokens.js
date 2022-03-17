import client from "./client";
import authStorage from "../../app/auth/storage";

const getUser = async () => {
  return await authStorage.getUser();
};

const register = async (pushToken) => {
  try {
    client.post("/expo-push-tokens", {
      data: {
        token: pushToken.data,
        users_permissions_user: (await getUser()).id,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export default {
  register,
};
