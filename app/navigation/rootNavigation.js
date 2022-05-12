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
  const { user, setUser } = useContext(AuthenticatedUserContext);

  // Handle user state changes
  function onAuthStateChanged(user) {
    console.log(user);
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  const restoreUser = async () => {
    // auth().onAuthStateChanged(onAuthStateChanged);
  };

  if (initializing) {
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
