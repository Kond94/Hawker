import * as SplashScreen from "expo-splash-screen";

import React, { useCallback, useContext, useEffect, useState } from "react";

import AppNavigator from "./AppNavigator";
import AuthNavigator from "./AuthNavigator";
import { AuthenticatedUserContext } from "../auth/AuthenticatedUserProvider";
import { NavigationContainer } from "@react-navigation/native";
import { UserListingsProvider } from "../context/UserListingsProvider";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function RootNavigator(props) {
  // Set an initializing state whilst Firebase connects
  const [appIsReady, setAppIsReady] = useState(false);
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);
  // Handle user state changes
  useEffect(() => {
    let unsubscribeUserListings;

    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async (authenticatedUser) => {
        if (authenticatedUser) {
          setUser(authenticatedUser);
        } else setUser(null);
        setIsLoading(false);
      }
    );
    async function prepare() {
      try {
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();
        // Pre-load fonts, make any API calls you need to do here
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.log("Error");
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }
    prepare();
    return unsubscribeAuth, unsubscribeUserListings; // unsubscribe on unmount
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <NavigationContainer onReady={onLayoutRootView}>
      {user ? (
        <UserListingsProvider>
          <AppNavigator />
        </UserListingsProvider>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}
