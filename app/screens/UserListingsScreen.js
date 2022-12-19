import { FlatList, StyleSheet, View } from "react-native";

import ListingCard from "../components/ListingCard";
import React from "react";
import Screen from "../components/Screen";
import { UserListingsContext } from "../context/UserListingsProvider";
import { useContext } from "react";

function UserListingsScreen({ navigation }) {
  const { userListings, setUserListings } = useContext(UserListingsContext);
  console.log(userListings);
  return (
    <Screen>
      <FlatList
        data={userListings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ListingCard item={item} navigation={navigation} />
        )}
      />
    </Screen>
  );
}
const styles = StyleSheet.create({
  container: {},
});

export default UserListingsScreen;
