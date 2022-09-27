import ListingDetails from "../screens/ListingDetails";
import ListingDetailsScreen from "../screens/ListingDetailsScreen";
import Listings from "../screens/Listings";
import ListingsScreen from "../screens/ListingsScreen";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const FeedNavigator = () => (
  <Stack.Navigator
    screenOptions={{ headerShown: false, presentation: "modal" }}
  >
    <Stack.Screen name='Listings' component={Listings} />
    <Stack.Screen name='ListingDetails' component={ListingDetails} />
  </Stack.Navigator>
);

export default FeedNavigator;
