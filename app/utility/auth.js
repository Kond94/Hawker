import { AuthenticatedUserContext } from "../auth/AuthenticatedUserProvider";
import { useContext } from "react";

export const appUser = () => {
  const { user, setUser } = useContext(AuthenticatedUserContext);

  return user;
};
