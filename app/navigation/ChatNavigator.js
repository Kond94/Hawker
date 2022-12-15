import Chat from "../screens/Chat";
import ChatList from "../screens/ChatList";
import MessagesScreen from "../screens/MessagesScreen";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const ChatNavigator = () => (
  <Stack.Navigator
    screenOptions={{ headerShown: false, presentation: "modal" }}
  >
    <Stack.Screen name='Chat' component={ChatList} />
    <Stack.Screen name='Chats' component={Chat} />
  </Stack.Navigator>
);

export default ChatNavigator;
