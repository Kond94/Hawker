import LoginScreen from "../screens/LoginScreen";
import React from "react";
import RegisterScreen from "../screens/RegisterScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name='Welcome' component={WelcomeScreen} />
    <Stack.Screen name='Login' component={LoginScreen} />
    <Stack.Screen name='Register' component={RegisterScreen} />
  </Stack.Navigator>
);

export default AuthNavigator;
