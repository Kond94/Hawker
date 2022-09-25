import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";

import AccountNavigator from "./AccountNavigator";
import { BottomFabBar } from "rn-wave-bottom-bar";
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
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarActiveBackgroundColor: colors.medium,
        tabBarInactiveTintColor: colors.black,
        tabBarHideOnKeyboard: true,
      }}
      tabBar={(props) => (
        <BottomFabBar
          isRtl={false}
          // Add Shadow for active tab bar button
          focusedButtonStyle={{
            shadowColor: "#000",
            backGroundColor: "#0000",
            shadowOffset: {
              width: 0,
              height: 7,
            },
            shadowOpacity: 0.6,
            shadowRadius: 9.11,
            elevation: 3,
          }}
          // - You can add the style below to show screen content under the tab-bar
          // - It will makes the "transparent tab bar" effect.
          bottomBarContainerStyle={{
            height: 50,
            backgroundColor: "#0000",
          }}
          {...props}
        />
      )}
    >
      <Tab.Screen
        name='Home'
        component={FeedNavigator}
        options={{
          tabBarLabel: "Listings",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name='home' color={color} size={25} />
          ),
        }}
      />
      <Tab.Screen
        name='Stores'
        component={StoreNavigator}
        options={{
          tabBarLabel: "Stores",

          tabBarIcon: ({ color, size }) => (
            <AntDesign name='appstore-o' color={color} size={25} />
          ),
        }}
      />
      {!user.isAnonymous ? (
        <>
          <Tab.Screen
            name='ListingEdit'
            component={ListingEditScreen}
            options={({ navigation }) => ({
              tabBarLabel: "Create",

              tabBarButton: () => (
                <NewListingButton
                  onPress={() => navigation.navigate(routes.LISTING_EDIT)}
                />
              ),
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name='plus-circle'
                  color={color}
                  size={25}
                />
              ),
            })}
          />
          <Tab.Screen
            name='Messaging'
            component={ChatNavigator}
            options={{
              tabBarLabel: "Messages",

              tabBarIcon: ({ color, size }) => (
                <AntDesign name='message1' color={color} size={25} />
              ),
            }}
          />
          <Tab.Screen
            name='AccountEdit'
            component={AccountNavigator}
            options={{
              tabBarLabel: "Account",
              tabBarIcon: ({ color, size }) => (
                <AntDesign name='user' color={color} size={25} />
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
