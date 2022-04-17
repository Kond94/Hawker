import React, { useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import AppLoading from "expo-app-loading";
import AppNavigator from "./AppNavigator";
import AuthNavigator from "./AuthNavigator";
import { AuthenticatedUserContext } from "../auth/AuthenticatedUserProvider";
import Firebase from "../config/firebase";
import { NavigationContainer } from "@react-navigation/native";

const auth = getAuth(Firebase);

export default function RootNavigator() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const { user, setUser } = useContext(AuthenticatedUserContext);

  function authStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth.onAuthStateChanged(authStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) {
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
