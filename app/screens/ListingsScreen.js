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
  const [selectedCategories, setSelectedCategories] = useState([]);
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
    <ImageBackground
      blurRadius={0.5}
      style={{ flex: 1 }}
      source={backgroundImage}
    >
      <ActivityIndicator visible={loading} />

      <Screen style={styles.screen}>
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
            <View style={styles.top_category_bar}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                {slides.map((item, key) => (
                  <View key={key} style={styles.top_category_inner_block}>
                    <Image
                      source={{
                        uri: item.uri,
                      }}
                      style={styles.top_category_image}
                    />
                    <View style={styles.top_category_text_block}>
                      <Text style={styles.top_category_text}>{item.title}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </>
        )}

        <FlatList
          ListHeaderComponent={() =>
            appUser().isAnonymous ? (
              <InfoWithAction onButtonPress={() => signOut()} />
            ) : (
              <></>
            )
          }
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  top_category_bar: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#fff",
  },

  top_category_inner_block: {
    margin: 5,
    marginTop: 0,
  },
  box_product: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: 105,
    borderColor: "#f0f0f0",
    borderWidth: 1,
    margin: 4,
  },
  top_category_image: {
    resizeMode: "contain",
    width: 50,
    height: 50,
    margin: 2,
    marginTop: 10,
  },

  top_category_text_block: {
    flexDirection: "row",
    justifyContent: "space-between",
    justifyContent: "center",
  },

  top_category_text: {
    color: "#494949",
    fontWeight: "200",
    fontSize: 11,
  },
  card: { marginVertical: 5 },
  screen: {
    paddingHorizontal: 5,
    backgroundColor: "transparent",
  },
  filterBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 17,
  },
  searchBox: {
    alignItems: "center",
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
    margin: 10,
  },
});

export default ListingsScreen;
