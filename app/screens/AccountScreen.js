import { FlatList, StyleSheet, View } from "react-native";
import { ListItem, ListItemSeparator } from "../components/lists";
import React, { useContext } from "react";

import { AuthenticatedUserContext } from "../auth/AuthenticatedUserProvider";
import Firebase from "../config/firebase";
import Icon from "../components/Icon";
import ImageBackground from "react-native/Libraries/Image/ImageBackground";
import Screen from "../components/Screen";
import colors from "../config/colors";
import routes from "../navigation/routes";

const auth = Firebase.auth();
const menuItems = [
  {
    title: "My Listings",
    icon: {
      name: "format-list-bulleted",
      backgroundColor: colors.primary,
    },
  },
  {
    title: "My Messages",
    icon: {
      name: "email",
      backgroundColor: colors.secondary,
    },
    targetScreen: routes.MESSAGES,
  },
];

function AccountScreen({ navigation }) {
  const { user } = useContext(AuthenticatedUserContext);
  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ImageBackground
      blurRadius={0.5}
      style={{ flex: 1 }}
      source={require("../assets/app-background.png")}
    >
      <Screen style={styles.screen}>
        <View style={styles.container}>
          <ListItem
            title={user.displayName}
            subTitle={user.email}
            image={{
              uri: user.photoURL
                ? user.photoURL
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
          onPress={handleSignOut}
        />
      </Screen>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "transparent",
  },
  container: {
    marginVertical: 20,
  },
});

export default AccountScreen;
