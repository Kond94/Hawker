import React, { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import ActivityIndicator from "../components/ActivityIndicator";
import Button from "../components/Button";
import Card from "../components/Card";
import colors from "../config/colors";
import routes from "../navigation/routes";
import Screen from "../components/Screen";
import AppText from "../components/Text";
import Firebase from "../config/firebase";

function ListingsScreen({ navigation }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscriber = Firebase.firestore()
      .collection("Listings")
      .onSnapshot((querySnapShot) => {
        const listings = [];
        querySnapShot.forEach((item) => {
          listings.push({ id: item.id, ...item.data() });
        });
        setListings(listings);
        setLoading(false);
      });

    // Unsubscribe from events when no longer in use
    return () => {
      subscriber(); // This worked for me
    };
  }, []);

  return (
    <>
      <ActivityIndicator visible={false} />
      <Screen style={styles.screen}>
        {false && (
          <>
            <AppText>Couldn't retrieve the listings.</AppText>
            <Button
              title='Retry'
              onPress={() => console.log("Function to get listings")}
            />
          </>
        )}
        <FlatList
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={() => console.log("Pulled To Refresh")}
          data={listings}
          keyExtractor={(listing) => listing.id.toString()}
          renderItem={({ item }) => {
            return (
              <Card
                title={item.title}
                subTitle={"$" + item.price}
                imageUrl={item.images[0]}
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
