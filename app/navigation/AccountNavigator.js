import React, { useLayoutEffect } from "react";

import AccountScreen from "../screens/AccountScreen";
import Appstyles from "../config/Appstyles";
import MessagesScreen from "../screens/MessagesScreen";
import UserListingsScreen from "../screens/UserListingsScreen";
import { createStackNavigator } from "@react-navigation/stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

const Stack = createStackNavigator({ navigation, route });

const AccountNavigator = ({ navigation, route }) => {
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === "Chats") {
      navigation.setOptions({ display: "none" });
    } else {
      navigation.setOptions(Appstyles.tabBarStyle);
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
