import React, { useContext, useEffect, useState } from "react";

import { AuthenticatedUserContext } from "../auth/AuthenticatedUserProvider";
import auth from "@react-native-firebase/auth";

export const signOut = async () => {
  auth().signOut();
  setUser(null);
};

export const appUser = () => {
  const { user, setUser } = useContext(AuthenticatedUserContext);

  return user;
};
