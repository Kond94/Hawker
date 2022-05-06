import AppTextInput from "../components/TextInput";
import { BlurView } from "expo-blur";
import Icon from "../components/Icon";
import ListingDetailsScreen from "../screens/ListingDetailsScreen";
import ListingsScreen from "../screens/ListingsScreen";
import React from "react";
import { View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const FeedNavigator = () => (
  <Stack.Navigator mode='modal' screenOptions={{ headerShown: false }}>
    <Stack.Screen name='Listings' component={ListingsScreen} />
    <Stack.Screen name='ListingDetails' component={ListingDetailsScreen} />
  </Stack.Navigator>
);

export default FeedNavigator;
