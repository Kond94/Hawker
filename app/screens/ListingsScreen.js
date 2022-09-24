import { Card, CardContent, CardImage } from "react-native-cards";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { appUser, signOut } from "../utility/auth";
import { getCategories, getListings } from "../utility/fireStore";

import ActivityIndicator from "../components/ActivityIndicator";
import AppText from "../components/Text";
import AppTextInput from "../components/TextInput";
import Button from "../components/Button";
import ImageBackground from "react-native/Libraries/Image/ImageBackground";
import InfoWithAction from "../components/InfoWithAction";
import Screen from "../components/Screen";
import routes from "../navigation/routes";
import { slides } from "../utility/dummyData";

function ListingsScreen({ navigation, route }) {
  const backgroundImage = require("../assets/app-background.png");

  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const authorFilter = route.params?.authorListings ? true : false;
  const author = authorFilter ? route.params?.author : null;

  useEffect(() => {
    const listingsSubscriber = getListings(
      setListings,
      setFilteredListings,
      setLoading
    );

    const categoriesSubscriber = getCategories(setCategories);
    return listingsSubscriber, categoriesSubscriber;
  }, []);

  const filterListings = (searchText) => {
    let filteredListings = listings;
    searchText.length > 0
      ? (filteredListings = listings?.filter(
          (listing) =>
            listing.title.toLowerCase().includes(searchText.toLowerCase()) ||
            listing.description.toLowerCase().includes(searchText.toLowerCase())
        ))
      : {};

    setFilteredListings(filteredListings);
  };

  return (
    <Screen>
      <ActivityIndicator visible={loading} />

      {false && (
        <>
          <AppText>Couldn't retrieve the listings.</AppText>
          <Button title='Retry' onPress={() => {}} />
        </>
      )}
      {authorFilter ? (
        <InfoWithAction
          buttonTitle='clear'
          information={"Viewing listings by: " + author.name}
          onButtonPress={() =>
            navigation.navigate("Listings", { authorListings: undefined })
          }
        />
      ) : (
        <>
          <View style={styles.searchBox}>
            <AppTextInput
              placeholder='Search Listings'
              onChangeText={filterListings}
            />
          </View>
          {appUser().isAnonymous ? (
            <InfoWithAction onButtonPress={() => signOut()} />
          ) : (
            <></>
          )}
        </>
      )}

      <FlatList
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        data={authorFilter ? route.params.authorListings : filteredListings}
        keyExtractor={(listing) => listing.id.toString()}
        renderItem={({ item }) => {
          return (
            <TouchableNativeFeedback
              onPress={() =>
                navigation.navigate(routes.LISTING_DETAILS, {
                  item: item,
                })
              }
            >
              <View style={styles.card}>
                <Card>
                  <CardImage
                    source={{ uri: item.images[0] }}
                    title={"k " + item.price}
                  />
                  <CardContent text={item.title} />
                </Card>
              </View>
            </TouchableNativeFeedback>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { marginVertical: 5 },

  searchBox: {
    alignItems: "center",
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
    margin: 10,
  },
});

export default ListingsScreen;
