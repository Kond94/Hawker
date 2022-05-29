import { Card, CardContent, CardImage, CardTitle } from "react-native-cards";
import {
  FlatList,
  StyleSheet,
  TouchableNativeFeedback,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { appUser, signOut } from "../utility/auth";
import { categoriesCollection, listingsCollection } from "../utility/fireStore";

import ActivityIndicator from "../components/ActivityIndicator";
import AppButton from "../components/Button";
import AppText from "../components/Text";
import AppTextInput from "../components/TextInput";
import Button from "../components/Button";
import ImageBackground from "react-native/Libraries/Image/ImageBackground";
import InfoWithAction from "../components/InfoWithAction";
import Screen from "../components/Screen";
import SelectBox from "react-native-multi-selectbox";
import colors from "../config/colors";
import routes from "../navigation/routes";
import { xorBy } from "lodash";

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
    const listingsSubscriber = listingsCollection(
      setListings,
      setFilteredListings,
      setLoading
    );

    const categoriesSubscriber = categoriesCollection(setCategories);
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

  const onFilterChange = (item) => {
    setSelectedCategories(xorBy(selectedCategories, [item], "id"));
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
          <View style={styles.searchBox}>
            <AppTextInput
              placeholder='Search Listings'
              onChangeText={filterListings}
            />
          </View>
        )}

        <FlatList
          ListHeaderComponent={() => (
            <>
              {appUser().isAnonymous ? (
                <InfoWithAction onButtonPress={() => signOut()} />
              ) : (
                <></>
              )}
              <View style={styles.filterBox}>
                <SelectBox
                  label='Filter'
                  labelStyle={{ fontSize: 15, color: colors.secondary }}
                  options={categories}
                  selectedValues={selectedCategories}
                  onMultiSelect={onFilterChange}
                  onTapClose={onFilterChange}
                  isMulti
                  multiOptionContainerStyle={{ margin: 5 }}
                />
              </View>
            </>
          )}
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
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "center",
    margin: 10,
  },
});

export default ListingsScreen;
