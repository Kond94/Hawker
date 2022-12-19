import { FlatList, StyleSheet, View } from "react-native";
import { ListItem, ListItemSeparator } from "../components/lists";

import { AuthenticatedUserContext } from "../auth/AuthenticatedUserProvider";
import Icon from "../components/Icon";
import ImageBackground from "react-native/Libraries/Image/ImageBackground";
import React from "react";
import Screen from "../components/Screen";
import { auth } from "../config/firebase";
import colors from "../config/colors";
import routes from "../navigation/routes";
import { signOut } from "firebase/auth";
import { useContext } from "react";

const menuItems = [
  {
    title: "My Listings",
    icon: {
      name: "format-list-bulleted",
      backgroundColor: colors.primary,
    },
    targetScreen: routes.USER_LISTINGS,
  },
  {
    title: "My Favorites",
    icon: {
      name: "heart",
      backgroundColor: colors.secondary,
    },
    targetScreen: routes.MESSAGING,
  },
];

function AccountScreen({ navigation }) {
  const { user, setUser } = useContext(AuthenticatedUserContext);

  return (
    <ImageBackground
      blurRadius={0.5}
      style={{ flex: 1 }}
      source={require("../assets/app-background.png")}
    >
      <Screen style={styles.screen}>
        <View style={styles.container}>
          <ListItem
            title={user?.displayName}
            subTitle={user?.email}
            image={{
              uri: user?.photoURL
                ? user?.photoURL
                : "https://avatars.dicebear.com/api/:human/:seed.svg",
            }}
          />
        </View>
        <View style={styles.container}>
          <FlatList
            data={menuItems}
            keyExtractor={(menuItem) => menuItem.title}
            ItemSeparatorComponent={ListItemSeparator}
            renderItem={({ item }) => (
              <ListItem
                title={item.title}
                IconComponent={
                  <Icon
                    name={item.icon.name}
                    backgroundColor={item.icon.backgroundColor}
                  />
                }
                onPress={() => navigation.navigate(item.targetScreen)}
              />
            )}
          />
        </View>
        <ListItem
          title='Log Out'
          IconComponent={<Icon name='logout' backgroundColor={colors.danger} />}
          onPress={() =>
            signOut(auth).catch((error) =>
              console.log("Error logging out: ", error)
            )
          }
        />
      </Screen>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "transparent",
    padding: 10,
  },
  container: {
    marginVertical: 20,
  },
});

export default AccountScreen;
