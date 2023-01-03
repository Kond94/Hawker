import React, { useLayoutEffect } from "react";

import AccountScreen from "../screens/AccountScreen";
import Appstyles from "../config/Appstyles";
import MessagesScreen from "../screens/MessagesScreen";
import UserListingsScreen from "../screens/UserListingsScreen";
import { createStackNavigator } from "@react-navigation/stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

const Stack = createStackNavigator();

const AccountNavigator = ({ navigation, route }) => {
  useLayoutEffect(() => {
    const tabHiddenRoutes = ["UserListings", "Favorites"];

    if (tabHiddenRoutes.includes(getFocusedRouteNameFromRoute(route))) {
      navigation.setOptions({ tabBarStyle: { display: "none" } });
    } else {
      navigation.setOptions({ tabBarStyle: Appstyles.tabBarStyle });
    }
  }, [navigation, route]);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Account' component={AccountScreen} />
      <Stack.Screen name='UserListings' component={UserListingsScreen} />
    </Stack.Navigator>
  );
};

export default AccountNavigator;
