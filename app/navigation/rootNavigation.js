import React, { useContext, useEffect, useState } from "react";

import AppLoading from "expo-app-loading";
import AppNavigator from "./AppNavigator";
import AuthNavigator from "./AuthNavigator";
import { AuthenticatedUserContext } from "../auth/AuthenticatedUserProvider";
import { NavigationContainer } from "@react-navigation/native";
import auth from "@react-native-firebase/auth";

export default function RootNavigator(props) {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [loggingInAnonymous, setLoggingInAnonymous] = useState(true);
  const { user, setUser } = useContext(AuthenticatedUserContext);

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  const restoreUser = async () => {
    // console.log("starting");
  };

  loginAnonymous = async () => {
    setLoggingInAnonymous(true);
    await auth()
      .signInAnonymously()
      .then(() => {
        // console.log("User signed in anonymously");
      })
      .catch((error) => {
        if (error.code === "auth/operation-not-allowed") {
          console.log("Enable anonymous in your firebase console.");
        }

        console.error(error);
      });
    setLoggingInAnonymous(false);
  };

  useEffect(() => {
    loginAnonymous();
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing || loggingInAnonymous) {
    return (
      <AppLoading
        startAsync={restoreUser}
        onFinish={() => setInitializing(false)}
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
