import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { ListItem, ListItemSeparator } from "../components/lists";

import AppText from "../components/Text";
import Appstyles from "../config/Appstyles";
import { AuthenticatedUserContext } from "../auth/AuthenticatedUserProvider";
import Icon from "../components/Icon";
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
      backgroundColor: colors.secondary,
    },
    targetScreen: routes.USER_LISTINGS,
  },
  {
    title: "My Favorites",
    icon: {
      name: "heart",
      backgroundColor: colors.primary,
    },
    targetScreen: routes.LIKED_LISTINGS,
  },
];

function AccountScreen({ navigation }) {
  const { user, setUser } = useContext(AuthenticatedUserContext);

  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        <ListItem
          title={user?.displayName}
          subTitle={user?.email}
          image={
            user?.photoURL
              ? user?.photoURL
              : "https://ui-avatars.com/api/?background=random"
          }
        />
      </View>
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
        ListFooterComponent={() => (
          <ListItem
            title='Log Out'
            IconComponent={
              <Icon name='logout' backgroundColor={colors.danger} />
            }
            onPress={() =>
              signOut(auth).catch((error) =>
                console.log("Error logging out: ", error)
              )
            }
          />
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
});

export default AccountScreen;
