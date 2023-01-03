import React, { useLayoutEffect } from "react";

import Appstyles from "../config/Appstyles";
import ListingDetails from "../screens/ListingDetails";
import ListingsScreen from "../screens/ListingsScreen";
import { createStackNavigator } from "@react-navigation/stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

const Stack = createStackNavigator();

const FeedNavigator = ({ navigation, route }) => {
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);

    if (routeName === "ListingDetails") {
      navigation.setOptions({ tabBarStyle: { display: "none" } });
    } else {
      navigation.setOptions({ tabBarStyle: Appstyles.tabBarStyle });
    }
  }, [navigation, route]);

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, presentation: "modal" }}
    >
      <Stack.Screen name='Listings' component={ListingsScreen} />
      <Stack.Screen name='ListingDetails' component={ListingDetails} />
    </Stack.Navigator>
  );
};

export default FeedNavigator;
