import React, { useLayoutEffect } from "react";

import AccountScreen from "../screens/AccountScreen";
import Appstyles from "../config/Appstyles";
import LikedListingsScreen from "../screens/LikedListingsScreen";
import { TransitionPresets } from "@react-navigation/stack";
import UserListingsScreen from "../screens/UserListingsScreen";
import { createStackNavigator } from "@react-navigation/stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

const Stack = createStackNavigator();

const AccountNavigator = ({ navigation, route }) => {
  useLayoutEffect(() => {
    const tabHiddenRoutes = ["UserListings", "LikedListings"];

    if (tabHiddenRoutes.includes(getFocusedRouteNameFromRoute(route))) {
      navigation.setOptions({
        tabBarStyle: { display: "none" },
        headerShown: false,
      });
    } else {
      navigation.setOptions({ tabBarStyle: Appstyles.tabBarStyle });
    }
  }, [navigation, route]);
  return (
    <Stack.Navigator
      screenOptions={{
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
      <Stack.Screen name='Account' component={AccountScreen} />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name='UserListings'
        component={UserListingsScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name='LikedListings'
        component={LikedListingsScreen}
      />
    </Stack.Navigator>
  );
};

export default AccountNavigator;
