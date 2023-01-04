import * as SplashScreen from "expo-splash-screen";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

import AppNavigator from "./AppNavigator";
import AuthNavigator from "./AuthNavigator";
import { AuthenticatedUserContext } from "../auth/AuthenticatedUserProvider";
import { CategoriesContext } from "../context/CategoriesProvider";
import { LikedListingsProvider } from "../context/LikedListingsProvider";
import { ListingsContext } from "../context/ListingsProvider";
import { NavigationContainer } from "@react-navigation/native";
import { UserListingsProvider } from "../context/UserListingsProvider";
import { auth } from "../config/firebase";
import { database } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function RootNavigator(props) {
  // Set an initializing state whilst Firebase connects
  const [appIsReady, setAppIsReady] = useState(false);
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const { setListings } = useContext(ListingsContext);
  const { setCategories } = useContext(CategoriesContext);
  const [isLoading, setIsLoading] = useState(true);
  // Handle user state changes
  useEffect(() => {
    let unsubscribeUserListings;

    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async (authenticatedUser) => {
        if (authenticatedUser) {
          setUser(authenticatedUser);
          setIsLoading(false);
        } else setUser(null);
        setIsLoading(false);
      }
    );
    const listingsQuery = query(
      collection(database, "Listings"),
      orderBy("createdAt", "desc")
    );

    const unsubscribeListings = onSnapshot(listingsQuery, (querySnapshot) => {
      const listings = [];
      querySnapshot.forEach((doc) => {
        listings.push({
          id: doc.id,
          ...doc.data(),
          price: parseInt(doc.data().price),
          createdAt: new Date(doc.data().createdAt.seconds * 1000),
        });
      });
      setListings(listings);
    });

    const categoriesQuery = query(collection(database, "Categories"));
    const unsubscribeCategories = onSnapshot(
      categoriesQuery,
      (querySnapshot) => {
        const categories = [];
        querySnapshot.forEach((doc) => {
          categories.push({
            id: doc.id,
            label: doc.data().label,
            icon: doc.data().icon,
            backgroundColor: doc.data().backgroundColor,
          });
        });
        setCategories(categories);
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
        if (!isLoading) setAppIsReady(true);
      }
    }
    prepare();
    return unsubscribeAuth, unsubscribeListings, unsubscribeCategories; // unsubscribe on unmount
  }, [isLoading]);

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
          <LikedListingsProvider>
            <AppNavigator />
          </LikedListingsProvider>
        </UserListingsProvider>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}
