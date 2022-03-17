import React, { useContext, useEffect } from "react";
import { FlatList, StyleSheet } from "react-native";
import ActivityIndicator from "../components/ActivityIndicator";
import Button from "../components/Button";
import Card from "../components/Card";
import colors from "../config/colors";
import listingsApi from "../api/listings";
import routes from "../navigation/routes";
import Screen from "../components/Screen";
import AppText from "../components/Text";
import useApi from "../hooks/useApi";
import imagesApi from "../api/imagesApi";
import { ListingContext } from "../context/ListingContext";

function ListingsScreen({ navigation }) {
  const { listings, addNewListing } = useContext(ListingContext);

  const getListingsApi = useApi(listingsApi.getListings);
  const apiListings = listingsApi.mapListings(getListingsApi.data);
  console.log(listings);

  for (let index = 0; index < apiListings.length; index++) {
    addNewListing(apiListings[index]);
  }
  useEffect(async () => {
    getListingsApi.request();
  }, []);

  return (
    <>
      <ActivityIndicator visible={getListingsApi.loading} />
      <Screen style={styles.screen}>
        {getListingsApi.error && (
          <>
            <AppText>Couldn't retrieve the listings.</AppText>
            <Button title='Retry' onPress={getListingsApi.request} />
          </>
        )}
        <FlatList
          showsVerticalScrollIndicator={false}
          data={listings}
          keyExtractor={(listing) => listing.id.toString()}
          renderItem={({ item }) => {
            return (
              <Card
                title={item.title}
                subTitle={"$" + item.price}
                imageUrl={item.imageUrl}
                onPress={() =>
                  navigation.navigate(routes.LISTING_DETAILS, item)
                }
              />
            );
          }}
        />
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 10,
    backgroundColor: colors.light,
  },
});

export default ListingsScreen;
