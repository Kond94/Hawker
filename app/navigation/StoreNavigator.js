import React from "react";
import StoreScreen from "../screens/StoreScreen";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const StoreNavigator = () => (
  <Stack.Navigator
    screenOptions={{ headerShown: false, presentation: "modal" }}
  >
    <Stack.Screen name='Store' component={StoreScreen} />
  </Stack.Navigator>
);

export default StoreNavigator;
