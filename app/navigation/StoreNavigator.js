import React from "react";
import StoreScreen from "../screens/StoreScreen";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const StoreNavigator = () => (
  <Stack.Navigator mode='modal' screenOptions={{ headerShown: false }}>
    <Stack.Screen name='Store' component={StoreScreen} />
  </Stack.Navigator>
);

export default StoreNavigator;
