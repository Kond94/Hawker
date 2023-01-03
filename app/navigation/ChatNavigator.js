import React, { useLayoutEffect } from "react";

import Appstyles from "../config/Appstyles";
import ChatListScreen from "../screens/ChatListScreen";
import ChatScreen from "../screens/ChatScreen";
import MessagesScreen from "../screens/MessagesScreen";
import { createStackNavigator } from "@react-navigation/stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

const Stack = createStackNavigator();

const ChatNavigator = ({ navigation, route }) => {
  useLayoutEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route);

    if (routeName === "Chats") {
      navigation.setOptions({ tabBarStyle: { display: "none" } });
    } else {
      navigation.setOptions({ tabBarStyle: Appstyles.tabBarStyle });
    }
  }, [navigation, route]);
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, presentation: "modal" }}
    >
      <Stack.Screen name='ChatList' component={ChatListScreen} />
      <Stack.Screen name='Chats' component={ChatScreen} />
    </Stack.Navigator>
  );
};

export default ChatNavigator;
