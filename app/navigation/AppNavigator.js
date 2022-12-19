import * as Animatable from "react-native-animatable";

import React, { useContext, useEffect, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import AccountNavigator from "./AccountNavigator";
import { AuthenticatedUserContext } from "../auth/AuthenticatedUserProvider";
import ChatNavigator from "./ChatNavigator";
import FeedNavigator from "./FeedNavigator";
import Icon from "../components/Icon";
import ListingEditScreen from "../screens/ListingEditScreen";
import StoreNavigator from "./StoreNavigator";
import { UserListingsContext } from "../context/UserListingsProvider";
import colors from "../config/colors";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { database } from "../config/firebase";

const TabArr = [
  {
    route: "Home",
    label: "Home",
    icon: "home",
    size: 50,
    component: FeedNavigator,
    color: colors.primary,
    alphaClr: colors.secondary,
  },
  // {
  //   route: "Stores",
  //   label: "Stores",
  //   icon: "grid",
  //   size: 50,

  //   component: StoreNavigator,
  //   color: colors.green,
  //   alphaClr: colors.greenAlpha,
  // },
  {
    route: "ListingEdit",
    label: "New",
    icon: "plus-circle",
    size: 75,

    component: ListingEditScreen,
    color: colors.red,
    alphaClr: colors.redAlpha,
  },
  {
    route: "Messaging",
    label: "Messages",
    size: 50,

    icon: "message",
    component: ChatNavigator,
    color: colors.purple,
    alphaClr: colors.purpleAlpha,
  },
  {
    route: "AccountEdit",
    label: "Account",
    icon: "account",
    size: 50,

    component: AccountNavigator,
    color: colors.purple,
    alphaClr: colors.purpleAlpha,
  },
];

const Tab = createBottomTabNavigator();
const animate1 = {
  0: { scale: 0.5, translateY: 7 },
  // 0.92: { translateY: -34 },
  1: { scale: 1.2, translateY: -10 },
};
const animate2 = {
  0: { scale: 1.2, translateY: -10 },
  1: { scale: 1, translateY: 7 },
};

const circle1 = {
  0: { scale: 0 },
  0.3: { scale: 0.9 },
  0.5: { scale: 0.2 },
  0.8: { scale: 0.7 },
  1: { scale: 1 },
};
const circle2 = { 0: { scale: 1 }, 1: { scale: 0 } };

const TabButton = (props) => {
  const { item, onPress, accessibilityState } = props;
  const focused = accessibilityState.selected;
  const viewRef = useRef(null);
  const circleRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (focused) {
      viewRef.current.animate(animate1);
      circleRef.current.animate(circle1);
      textRef.current.transitionTo({ scale: 1 });
    } else {
      viewRef.current.animate(animate2);
      circleRef.current.animate(circle2);
      textRef.current.transitionTo({ scale: 0 });
    }
  }, [focused]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={styles.container}
    >
      <Animatable.View ref={viewRef} duration={200} style={styles.container}>
        <View style={styles.btn}>
          <Animatable.View ref={circleRef} style={styles.circle} />
          <Icon
            type={item.type}
            name={item.icon}
            iconColor={focused ? colors.primaryDark : colors.white}
          />
        </View>
        <Animatable.Text ref={textRef} style={styles.text}>
          {item.label}
        </Animatable.Text>
      </Animatable.View>
    </TouchableOpacity>
  );
};

const AppNavigator = () => {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const { userListings, setUserListings } = useContext(UserListingsContext);

  useEffect(() => {
    const listingsQuery = query(
      collection(database, "Listings"),
      where("author", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const unsubscribeUserListings = onSnapshot(
      listingsQuery,
      (querySnapshot) => {
        const listings = [];
        querySnapshot.forEach((doc) => {
          listings.push({
            id: doc.id,
            ...doc.data(),
            price: parseInt(doc.data().price),
            createdAt: new Date(doc.data().createdAt.seconds * 1000),
          });
        });

        setUserListings(listings);
      }
    );
    return unsubscribeUserListings; //
  }, []);
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarActiveBackgroundColor: colors.medium,
        tabBarInactiveTintColor: colors.black,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          height: 60,
          position: "absolute",
          bottom: 16,
          right: 16,
          left: 16,
          borderRadius: 16,
        },
      }}
    >
      {TabArr.map((item, index) => {
        return (
          <Tab.Screen
            key={index}
            name={item.route}
            component={item.component}
            options={{
              tabBarShowLabel: false,
              tabBarButton: (props) => <TabButton {...props} item={item} />,
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabBar: {
    height: 70,
    position: "absolute",
    bottom: 16,
    right: 16,
    left: 16,
    borderRadius: 16,
  },
  btn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: colors.white,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderRadius: 25,
  },
  text: {
    fontSize: 10,
    textAlign: "center",
    color: colors.primaryDark,
    fontWeight: "700",
  },
});

export default AppNavigator;
