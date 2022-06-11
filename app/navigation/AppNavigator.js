import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";

import AccountNavigator from "./AccountNavigator";
import BottomBar from "react-native-bottom-bar";
import ChatNavigator from "./ChatNavigator";
import FeedNavigator from "./FeedNavigator";
import Icon from "react-native-dynamic-vector-icons";
import ListingEditScreen from "../screens/ListingEditScreen";
import NewListingButton from "./NewListingButton";
import React from "react";
import StoreNavigator from "./StoreNavigator";
import auth from "@react-native-firebase/auth";
import colors from "../config/colors";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import routes from "./routes";

const mainColor = "#373f4c";
const url = "www.freakycoder.com";
const pinkGradient = ["#ee9ca7", "#ffdde1"];
const pinkDarkGradient = ["#654ea3", "#eaafc8"];
const pinkyGradient = ["#DA4453", "#89216B"];
const pnkGradient = ["#bc4e9c", "#f80759"];
const Tab = createBottomTabNavigator();
const AppNavigator = () => {
  const renderMainIcon = (navigation) => (
    <TouchableWithoutFeedback
      onPress={() => navigation.navigate(routes.LISTING_EDIT)}
    >
      <MaterialCommunityIcons name='plus-circle' color={"#FFF"} size={50} />
    </TouchableWithoutFeedback>
  );

  const renderFirstIconComponent = (navigation) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate(routes.LISTINGS)}
        style={{
          ...Platform.select({
            ios: {
              right: 16,
            },
            android: {
              right: 8,
              top: 12,
            },
          }),
        }}
      >
        <AntDesign name='home' color='#000' size={30} />
      </TouchableOpacity>
    );
  };

  const renderSecondIconComponent = (navigation) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate(routes.STORES)}
        style={{
          ...Platform.select({
            ios: {
              right: 24,
              bottom: 3,
            },
            android: {
              top: 6,
            },
          }),
        }}
      >
        <AntDesign name='appstore-o' color={"#000"} size={30} />
      </TouchableOpacity>
    );
  };

  const renderThirdIconComponent = (navigation) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate(routes.MESSAGING)}
        style={{
          ...Platform.select({
            ios: {
              left: 24,
              bottom: 3,
            },
            android: {
              top: 6,
              left: 3,
            },
          }),
        }}
      >
        <AntDesign name='notification' color={"#000"} size={30} />
      </TouchableOpacity>
    );
  };

  const renderFourthIconComponent = (navigation) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate(routes.ACCOUNT)}
        style={{
          ...Platform.select({
            ios: {
              left: 16,
            },
            android: {
              left: 8,
              top: 12,
            },
          }),
        }}
      >
        <AntDesign name='user' color={"#000"} size={30} />
      </TouchableOpacity>
    );
  };
  const user = auth().currentUser;
  return (
    <Tab.Navigator
      tabBarOptions={{ activeTintColor: colors.primary }}
      tabBar={({ navigation }) => (
        <BottomBar
          shapeColor='#fbfbfb'
          miniButtonsColor='#f04913'
          mainIconGradient={pinkyGradient}
          mainIcon={renderMainIcon(navigation)}
          mainIconOnPress={() => navigation.navigate(routes.LISTING_EDIT)}
          firstIconComponent={renderFirstIconComponent(navigation)}
          secondIconComponent={renderSecondIconComponent(navigation)}
          thirdIconComponent={renderThirdIconComponent(navigation)}
          fourthIconComponent={renderFourthIconComponent(navigation)}
        />
      )}
    >
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
