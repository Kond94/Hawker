import ListingDetails from "../screens/ListingDetails";
import ListingsScreen from "../screens/ListingsScreen";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const FeedNavigator = () => (
  <Stack.Navigator
    screenOptions={{ headerShown: false, presentation: "modal" }}
  >
    <Stack.Screen name='Listings' component={ListingsScreen} />
    <Stack.Screen
      name='ListingDetails'
      component={ListingDetails}
      options={{
        tabBarStyle: { display: "none" },
      }}
    />
  </Stack.Navigator>
);

export default FeedNavigator;
