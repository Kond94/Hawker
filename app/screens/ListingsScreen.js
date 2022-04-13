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
import { ListingContext } from "../context/ListingContext";
function ListingsScreen({ navigation }) {
  const { listings, addNewListing } = useContext(ListingContext);
  const getListingsApi = useApi(listingsApi.getListings);
  console.log(listings);

  const refreshListings = () => {
    getListingsApi.request();
    getListingsApi.data.data.forEach((listing) => {
      addNewListing(listing);
    });
  };

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
          refreshing={getListingsApi.loading}
          onRefresh={() => refreshListings()}
          data={listings}
          keyExtractor={(listing) => listing.id.toString()}
          renderItem={({ item }) => {
            return (
              <Card
                title={item.title}
                subTitle={"$" + item.price}
                imageUrl={"http://192.168.43.100:1337" + item.images[0]}
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
