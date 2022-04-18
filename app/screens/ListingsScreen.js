import { FlatList, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";

import ActivityIndicator from "../components/ActivityIndicator";
import AppText from "../components/Text";
import Button from "../components/Button";
import Card from "../components/Card";
import Icon from "../components/Icon";
import ImageBackground from "react-native/Libraries/Image/ImageBackground";
import { ListItem } from "../components/lists";
import Screen from "../components/Screen";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import routes from "../navigation/routes";

function ListingsScreen({ navigation }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleSignOut = async () => {
    auth()
      .signOut()
      .then(() => console.log("User signed out!"));
  };
  useEffect(() => {
    const subscriber = firestore()
      .collection("Listings")
      .orderBy("createdAt", "desc")
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
      return subscriber(); // This worked for me
    };
  }, []);

  return (
    <>
      <ImageBackground
        blurRadius={0.5}
        style={{ flex: 1 }}
        source={require("../assets/app-background.png")}
      >
        <ListItem
          title='Log Out'
          IconComponent={<Icon name='logout' backgroundColor='#ffe66d' />}
          onPress={handleSignOut}
        />
        <ActivityIndicator visible={false} />
        <Screen style={styles.screen}>
          {false && (
            <>
              <AppText>Couldn't retrieve the listings.</AppText>
              <Button title='Retry' onPress={() => {}} />
            </>
          )}
          <FlatList
            showsVerticalScrollIndicator={false}
            refreshing={loading}
            onRefresh={() => {}}
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
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 5,
    backgroundColor: "transparent",
  },
});

export default ListingsScreen;
