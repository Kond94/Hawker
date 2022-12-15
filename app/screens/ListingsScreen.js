import * as Animatable from "react-native-animatable";

import {
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { auth, database } from "../config/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";

import { Animations } from "../config/Animations";
import AppText from "../components/Text";
import AppTextInput from "../components/TextInput";
import BannerIcon from "../components/BannerIcon";
import Icon from "../components/Icon";
import { ListItem } from "../components/ListItem";
import Modal from "react-native-modal";
import Screen from "../components/Screen";
import SortModal from "../components/SortModal";
import appConfig from "../config/appConfig";
import colors from "../config/colors";
import routes from "../navigation/routes";

export default function ListingsScreen({ route, navigation }) {
  const viewRef = useRef(null);
  const animation = Animations[6];
  const [searchText, setSearchText] = useState("");
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setFilteredCategories] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const authorFilter = route.params?.authorListings ? true : false;
  const author = authorFilter ? route.params?.author : null;
  const [isModalVisible, setModalVisible] = useState(false);

  const [sort, setSort] = useState({
    order: "desc",
    field: "createdAt",
    min: appConfig.launchDate,
    max: appConfig.today,
  });

  useEffect(() => {
    const listingsQuery = query(collection(database, "Listings"));

    const unsubscribeListings = onSnapshot(listingsQuery, (querySnapshot) => {
      const listings = [];
      querySnapshot.forEach((doc) => {
        const createdAt = new Date(doc.data().createdAt.seconds * 1000);

        const price = doc.data().price;
        if (sort.field === "createdAt") {
          if (createdAt >= sort.min && createdAt <= sort.max) {
            listings.push({
              id: doc.id,
              ...doc.data(),
              price: parseInt(doc.data().price),
              createdAt: new Date(doc.data().createdAt.seconds * 1000),
            });
          }
        } else if (sort.field === "price") {
          if (price >= sort.min && price <= sort.max) {
            listings.push({
              id: doc.id,
              ...doc.data(),
              price: parseInt(doc.data().price),
              createdAt: new Date(doc.data().createdAt.seconds * 1000),
            });
          }
        }
      });
      setListings(listings);
      setFilteredListings(listings);
    });

    const categoriesQuery = query(collection(database, "Categories"));
    const unsubscribeCategories = onSnapshot(
      categoriesQuery,
      (querySnapshot) => {
        const categories = [];
        querySnapshot.forEach((doc) => {
          categories.push({
            id: doc.id,
            label: doc.data().label,
            icon: doc.data().icon,
            backgroundColor: doc.data().backgroundColor,
          });
        });
        setCategories(categories);
      }
    );

    const unsubscribe = navigation.addListener("focus", () => {
      viewRef.current.animate({ 0: { opacity: 0.5 }, 1: { opacity: 1 } });
    });
    // ToastAndroid.show(animation+ ' Animation', ToastAndroid.SHORT);
    return unsubscribe, unsubscribeListings, unsubscribeCategories;
  }, [navigation, sort]);

  // Render Methods

  const renderListing = ({ item: listing, index }) => (
    <ListItem
      item={listing}
      index={index}
      animation={animation}
      navigation={navigation}
    />
  );

  const renderEmptyListings = () => {
    const anim = {
      0: { translateY: 0 },
      0.5: { translateY: 5 },
      1: { translateY: 0 },
    };
    return (
      <View style={[styles.listEmpty]}>
        <Animatable.Text
          animation={anim}
          easing='ease-in-out'
          duration={1000}
          style={{ fontSize: 16 }}
          iterationCount={1}
        >
          Sorry, nothing to show.
        </Animatable.Text>
      </View>
    );
  };

  //Helper Methods

  const filterByCategory = (category) => {
    console.log(category);
    let filter = [...selectedCategories];
    if (!filter.includes(category)) {
      //checking weather array contain the id
      filter.push(category); //adding to array because value doesnt exists
    } else {
      filter.splice(filter.indexOf(category), 1); //deleting
    }
    console.log(filter);
    setFilteredCategories(filter);
    filter.length > 0
      ? setFilteredListings(
          listings.filter((listing) =>
            filter.map((c) => c.id).includes(listing.category.id)
          )
        )
      : setFilteredListings(listings);
  };

  const filterBySearch = (searchText) => {
    let filteredListings = [];

    selectedCategories.length > 0
      ? (filteredListings = listings.filter((listing) =>
          selectedCategories.map((c) => c.id).includes(listing.category.id)
        ))
      : (filteredListings = listings);

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
      <Modal
        testID={"modal"}
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        onSwipeComplete={() => setModalVisible(false)}
        swipeDirection={["down"]}
        style={styles.sortModal}
        animationInTiming={800}
        animationOutTiming={800}
        backdropTransitionInTiming={800}
        backdropTransitionOutTiming={800}
        backdropColor='#B4B3DB'
        backdropOpacity={0.8}
      >
        <SortModal
          sort={sort}
          setSort={setSort}
          toggleModal={() => setModalVisible(false)}
        />
      </Modal>

      <View style={styles.screenHeaderContainer}>
        <AppText style={styles.screenHeaderText}>Listings</AppText>

        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => {
              setSort({
                field: "createdAt",
                min: new Date(2022, 0, 1),
                max: new Date(),
                order: "desc",
              });
              setModalVisible(true);
            }}
          >
            <Icon
              name='sort'
              backgroundColor='#0000'
              iconColor='#000'
              circle={false}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.searchBox}>
        <AppTextInput
          icon='magnify'
          placeholder='Search'
          onChangeText={(value) => {
            setSearchText(value), filterBySearch(value);
          }}
          value={searchText}
        />
      </View>

      <Animatable.View
        ref={viewRef}
        easing={"ease-in-out"}
        duration={2000}
        style={{ flex: 1 }}
      >
        <FlatList
          data={authorFilter ? route.params.authorListings : filteredListings}
          keyExtractor={(a, i) => String(i)}
          numColumns={2}
          renderItem={renderListing}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={renderEmptyListings}
          ListHeaderComponent={() =>
            authorFilter ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AppText
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "#5d5d5d",
                    textAlign: "center",
                  }}
                >
                  {" "}
                  Listings By: {author.name}
                </AppText>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(routes.LISTINGS, {
                      author: null,
                      authorListings: null,
                    })
                  }
                >
                  <Icon
                    iconColor={colors.primary}
                    name='close-circle'
                    backgroundColor='#0000'
                    circle={false}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.categoriesContainer}>
                <View style={styles.categoriesHeaderContainer}>
                  <AppText style={styles.categoriesHeaderText}>
                    Select Categories
                  </AppText>
                  {selectedCategories.length > 0 || searchText.trim() !== "" ? (
                    <TouchableWithoutFeedback
                      onPress={() => {
                        setSearchText("");
                        setFilteredCategories([]);
                        setFilteredListings(listings);
                      }}
                    >
                      <View style={{ flexDirection: "row" }}>
                        <AppText
                          style={{
                            ...styles.categoriesHeaderText,
                            color: colors.primary,
                          }}
                        >
                          Clear
                        </AppText>

                        <Icon
                          iconColor={colors.primary}
                          name='filter-remove'
                          backgroundColor='#0000'
                          circle={false}
                        />
                      </View>
                    </TouchableWithoutFeedback>
                  ) : (
                    <></>
                  )}
                </View>

                <FlatList
                  showsHorizontalScrollIndicator={false}
                  data={categories}
                  horizontal
                  renderItem={({ item }) => (
                    <BannerIcon
                      item={item}
                      selectedItems={selectedCategories}
                      filter={filterByCategory}
                    />
                  )}
                />
              </View>
            )
          }
        />
      </Animatable.View>
    </Screen>
  );
}

export const styles = StyleSheet.create({
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(0, 0, 0, .08)",
  },
  listEmpty: {
    height: Dimensions.get("window").height,
    alignItems: "center",
    justifyContent: "flex-start",
    margin: 30,
  },

  categoriesContainer: {
    paddingHorizontal: 10,
  },
  categoriesHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 30,
  },
  categoriesHeaderText: {
    fontWeight: "bold",
    fontSize: 15,
    textAlignVertical: "bottom",
    color: colors.mediumRare,
  },
  noListingsText: { flex: 1, alignItems: "center", justifyContent: "center" },
  searchBox: {
    alignItems: "center",
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  screenHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  screenHeaderText: {
    fontWeight: "bold",
    fontSize: 25,
    textAlignVertical: "bottom",
    color: colors.mediumRare,
    marginHorizontal: 10,
  },
  sortModal: {
    justifyContent: "flex-end",
    margin: 0,
  },
});
