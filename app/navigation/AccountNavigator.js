import AccountScreen from "../screens/AccountScreen";
import MessagesScreen from "../screens/MessagesScreen";
import React from "react";
import UserListingsScreen from "../screens/UserListingsScreen";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const AccountNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name='Account' component={AccountScreen} />
    <Stack.Screen name='UserListings' component={UserListingsScreen} />
  </Stack.Navigator>
);

export default AccountNavigator;
