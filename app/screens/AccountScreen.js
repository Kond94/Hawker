import { FlatList, StyleSheet, View } from "react-native";
import { ListItem, ListItemSeparator } from "../components/lists";

import Icon from "../components/Icon";
import ImageBackground from "react-native/Libraries/Image/ImageBackground";
import InfoWithAction from "../components/InfoWithAction";
import React from "react";
import Screen from "../components/Screen";
import auth from "@react-native-firebase/auth";
import colors from "../config/colors";
import routes from "../navigation/routes";

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
    targetScreen: routes.MESSAGING,
  },
];

function AccountScreen({ navigation }) {
  const user = auth().currentUser;
  const handleSignOut = async () => {
    auth().signOut();
  };

  return (
    <ImageBackground
      blurRadius={0.5}
      style={{ flex: 1 }}
      source={require("../assets/app-background.png")}
    >
      <Screen style={styles.screen}>
        {auth().currentUser?.isAnonymous ? (
          <InfoWithAction
            information='Please sign in to customize app and user settings'
            buttonTitle='Sign In'
            onButtonPress={handleSignOut}
          />
        ) : (
          <>
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
              IconComponent={
                <Icon name='logout' backgroundColor={colors.danger} />
              }
              onPress={handleSignOut}
            />
          </>
        )}
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
