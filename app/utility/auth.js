import { AuthenticatedUserContext } from "../auth/AuthenticatedUserProvider";
import auth from "@react-native-firebase/auth";
import { useContext } from "react";

export const signOut = async () => {
  auth().signOut();
};

export const appUser = () => {
  const { user, setUser } = useContext(AuthenticatedUserContext);

  return user;
};
