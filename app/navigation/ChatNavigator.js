import React, { useLayoutEffect } from "react";

import Appstyles from "../config/Appstyles";
import Chat from "../screens/Chat";
import ChatList from "../screens/ChatList";
import MessagesScreen from "../screens/MessagesScreen";
import { createStackNavigator } from "@react-navigation/stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

const Stack = createStackNavigator();

const ChatNavigator = ({ navigation, route }) => {
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName === "Chats") {
      navigation.setOptions({ display: "none" });
    } else {
      navigation.setOptions(Appstyles.tabBarStyle);
    }
  }, [navigation, route]);
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, presentation: "modal" }}
    >
      <Stack.Screen name='Chat' component={ChatList} />
      <Stack.Screen name='Chats' component={Chat} />
    </Stack.Navigator>
  );
};

export default ChatNavigator;
