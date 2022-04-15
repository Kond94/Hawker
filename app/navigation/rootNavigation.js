import React, { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppLoading from "expo-app-loading";

import Firebase from "../config/firebase";
import { AuthenticatedUserContext } from "../auth/AuthenticatedUserProvider";
import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";

const auth = Firebase.auth();

export default function RootNavigator() {
  const { user, setUser } = useContext(AuthenticatedUserContext);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuth = auth.onAuthStateChanged(
      async (authenticatedUser) => {
        try {
          await (authenticatedUser
            ? setUser(authenticatedUser)
            : setUser(null));
          setIsLoading(false);
        } catch (error) {
          console.log("ehe user err kuno", error);
        }
      }
    );

    // unsubscribe auth listener on unmount
    return unsubscribeAuth;
  }, []);

  if (isLoading) {
    return (
      <AppLoading
        // startAsync={restoreUser}
        onFinish={() => setIsReady(true)}
        onError={console.warn}
      />
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
