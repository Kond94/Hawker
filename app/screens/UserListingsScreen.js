import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

import AppText from "../components/Text";
import Appstyles from "../config/Appstyles";
import Icon from "../components/Icon";
import ListItemSeparator from "../components/lists/ListItemSeparator";
import ListingCard from "../components/ListingCard";
import React from "react";
import Screen from "../components/Screen";
import { UserListingsContext } from "../context/UserListingsProvider";
import { useContext } from "react";

function UserListingsScreen({ navigation }) {
  const { userListings, setUserListings } = useContext(UserListingsContext);
  return (
    <Screen>
      <View style={Appstyles.screenHeaderContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name='arrow-left'
            backgroundColor='#0000'
            iconColor='#000'
            circle={false}
          />
        </TouchableOpacity>
        <AppText style={Appstyles.screenHeaderText}>Favorites</AppText>

        <View style={{ flexDirection: "row" }}></View>
      </View>
      <View style={{ marginTop: 20 }}>
        <FlatList
          data={userListings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ListingCard item={item} navigation={navigation} />
          )}
          ItemSeparatorComponent={ListItemSeparator}
        />
      </View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  container: {},
});

export default UserListingsScreen;
