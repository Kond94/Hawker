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
import AppText from "../components/Text";
import AppTextInput from "../components/TextInput";
import Button from "../components/Button";
import ImageBackground from "react-native/Libraries/Image/ImageBackground";
import Screen from "../components/Screen";
import SelectBox from "react-native-multi-selectbox";
import UserNotLoggedIn from "../components/UserNotLoggedIn";
import colors from "../config/colors";
import routes from "../navigation/routes";
import { xorBy } from "lodash";

function ListingsScreen({ navigation, authorFilter }) {
  console.log(appUser());
  const backgroundImage = require("../assets/app-background.png");
  const [searchText, setSearchText] = useState("");
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const listingsSubscriber = listingsCollection(
      setListings,
      setFilteredListings,
      setLoading,
      searchText
    );

    const categoriesSubscribe = categoriesCollection(setCategories);
    // Unsubscribe from events when no longer in use
    return () => {
      return listingsSubscriber, categoriesSubscribe;
    };
  }, []);

  const filterListings = (searchText) => {
    let filteredListings = listings?.filter(
      (listing) =>
        listing.title.toLowerCase().includes(searchText.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchText.toLowerCase())
    );

    authorFilter
      ? console.log("Yes, the parameter exists")
      : console.log("No, theres no parameter set.");

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
        <View style={styles.searchBox}>
          <AppTextInput
            placeholder='Search Listings'
            onChangeText={filterListings}
          />
        </View>
        <FlatList
          ListHeaderComponent={() => (
            <>
              {appUser().isAnonymous ? (
                <UserNotLoggedIn onButtonPress={signOut} />
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
          data={filteredListings ? filteredListings : listings}
          keyExtractor={(listing) => listing.id.toString()}
          renderItem={({ item }) => {
            return (
              <TouchableNativeFeedback
                onPress={() =>
                  navigation.navigate(routes.LISTING_DETAILS, item)
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
