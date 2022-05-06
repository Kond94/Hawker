import MessagesScreen from "../screens/MessagesScreen";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const ChatNavigator = () => (
  <Stack.Navigator mode='modal' screenOptions={{ headerShown: false }}>
    <Stack.Screen name='Chat' component={MessagesScreen} />
  </Stack.Navigator>
);

export default ChatNavigator;
