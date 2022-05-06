import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";

import AccountNavigator from "./AccountNavigator";
import ChatNavigator from "./ChatNavigator";
import FeedNavigator from "./FeedNavigator";
import ListingEditScreen from "../screens/ListingEditScreen";
import NewListingButton from "./NewListingButton";
import React from "react";
import StoreNavigator from "./StoreNavigator";
import auth from "@react-native-firebase/auth";
import colors from "../config/colors";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import routes from "./routes";

const Tab = createBottomTabNavigator();
const AppNavigator = () => {
  const user = auth().currentUser;
  return (
    <Tab.Navigator tabBarOptions={{ activeTintColor: colors.primary }}>
      <Tab.Screen
        name='Listings'
        component={FeedNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name='home' color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name='Stores'
        component={StoreNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name='appstore-o' color={color} size={size} />
          ),
        }}
      />
      {!user.isAnonymous ? (
        <>
          <Tab.Screen
            name='ListingEdit'
            component={ListingEditScreen}
            options={({ navigation }) => ({
              tabBarButton: () => (
                <NewListingButton
                  onPress={() => navigation.navigate(routes.LISTING_EDIT)}
                />
              ),
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name='plus-circle'
                  color={color}
                  size={size}
                />
              ),
            })}
          />
          <Tab.Screen
            name='Messaging'
            component={ChatNavigator}
            options={{
              tabBarIcon: ({ color, size }) => (
                <AntDesign name='message1' color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name='Account'
            component={AccountNavigator}
            options={{
              tabBarIcon: ({ color, size }) => (
                <AntDesign name='user' color={color} size={size} />
              ),
            }}
          />
        </>
      ) : (
        <></>
      )}
    </Tab.Navigator>
  );
};

export default AppNavigator;
