import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import AppText from "../components/Text";
import Appstyles from "../config/Appstyles";
import Icon from "../components/Icon";
import { LikedListingsContext } from "../context/LikedListingsProvider";
import ListItemSeparator from "../components/lists/ListItemSeparator";
import ListingCard from "../components/ListingCard";
import Screen from "../components/Screen";
import { database } from "../config/firebase";
import { useContext } from "react";

function LikedListingsScreen({ navigation }) {
  const [listings, setListings] = useState([]);
  const { likedListings, setLikedListings } = useContext(LikedListingsContext);
  useEffect(() => {
    const listingsQuery = query(
      collection(database, "Listings"),
      where(
        "__name__",
        "in",
        likedListings.map((l) => l.listingId)
      )
      // orderBy("createdAt", "desc")
    );
    const unsubscribeListings = onSnapshot(listingsQuery, (querySnapshot) => {
      const listings = [];
      querySnapshot.forEach((doc) => {
        listings.push({
          id: doc.id,
          ...doc.data(),
          price: parseInt(doc.data().price),
          createdAt: new Date(doc.data().createdAt.seconds * 1000),
        });
      });

      setListings(listings);
    });

    return unsubscribeListings; //
  }, []);

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
          data={listings}
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

export default LikedListingsScreen;
