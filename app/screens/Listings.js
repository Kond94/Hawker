import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getCategories, getListings } from "../utility/fireStore";

import AppButton from "../components/Button";
import AppText from "../components/Text";
import AppTextInput from "../components/TextInput";
import BannerIcon from "../components/BannerIcon";
import Icon from "../components/Icon";
import ListingCard from "../components/ListingCard";
import ListingsScreen from "./ListingsScreen";
import Modal from "react-native-modal";
import Screen from "../components/Screen";
import SortModal from "../components/SortModal";
import colors from "../config/colors";
import { currencyFormatter } from "../utility/numberFormat";
import { filters } from "../../node_modules/css-select/lib/index";

const _ = require("lodash");

const Listings = ({ navigation, route }) => {
  const [searchText, setSearchText] = useState("");
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setFilteredCategories] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const authorFilter = route.params?.authorListings ? true : false;
  const author = authorFilter ? route.params?.author : null;
  const [isModalVisible, setModalVisible] = useState(false);

  const [activeSort, setActiveSort] = useState("Date");
  const [fromDate, setFromDate] = useState(new Date("2020-12-31T00:00:00"));
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [order, setOrder] = useState("New to Old");

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    const listingsSubscriber = getListings(
      setListings,
      setFilteredListings,
      setLoading,
      sortListings
    );

    const categoriesSubscriber = getCategories(setCategories);

    return listingsSubscriber, categoriesSubscriber;
  }, []);

  const sortListings = (listings = filteredListings) => {
    let sortedListings = listings;

    switch (activeSort) {
      case "Date":
        sortedListings = sortedListings.filter((l) => l.createdAt >= fromDate);

        sortedListings = _.orderBy(
          sortedListings,
          "createdAt",
          order === "Old to New" ? "asc" : "desc"
        );
        break;
      case "Price":
        sortedListings = sortedListings.filter(
          (l) => l.price >= minPrice && l.price <= maxPrice
        );
        sortedListings = _.orderBy(
          sortedListings,
          "price",
          order === "Low to High" ? "asc" : "desc"
        );
        break;

      default:
        break;
    }

    setFilteredListings(sortedListings);
  };
  const filterByCategory = (category) => {
    let filter = [...selectedCategories];
    if (!filter.includes(category)) {
      //checking weather array contain the id
      filter.push(category); //adding to array because value doesnt exists
    } else {
      filter.splice(filter.indexOf(category), 1); //deleting
    }
    setFilteredCategories(filter);
    filter.length > 0
      ? sortListings(
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
        style={styles.sortModal}
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
      >
        <SortModal
          toggleModal={toggleModal}
          sortListings={sortListings}
          sortDetails={{
            activeSort: activeSort,
            setActiveSort: setActiveSort,
            fromDate: fromDate,
            setFromDate: setFromDate,
            minPrice: minPrice,
            setMinPrice: setMinPrice,
            maxPrice: maxPrice,
            setMaxPrice: setMaxPrice,
            order: order,
            setOrder: setOrder,
          }}
          allListings={listings}
        />
      </Modal>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <AppText style={styles.screenHeaderText}>Listings</AppText>

        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={toggleModal}>
            <Icon
              name='sort'
              backgroundColor='#0000'
              iconColor='#000'
              circle={false}
            />
          </TouchableOpacity>
          {selectedCategories.length > 0 || searchText.trim() !== "" ? (
            <TouchableWithoutFeedback
              onPress={() => {
                setSearchText("");
                setFilteredCategories([]);
                sortListings(listings);
              }}
            >
              <View>
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

      <View style={styles.categoriesContainer}>
        <View style={styles.categoriesHeaderContainer}>
          <AppText style={styles.categoriesHeaderText}>Category</AppText>
          <AppText style={styles.categoriesHeaderText}>See All</AppText>
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
              sort={sortListings}
            />
          )}
        />
      </View>
      <FlatList
        style={{ marginVertical: 10 }}
        showsVerticalScrollIndicator={false}
        data={authorFilter ? route.params.authorListings : filteredListings}
        renderItem={({ item }) => (
          <ListingCard navigation={navigation} item={item} />
        )}
        ItemSeparatorComponent={() => (
          <View
            style={{
              borderBottomWidth: 1,
              borderColor: colors.medium,
              margin: 15,
            }}
          ></View>
        )}
        ListFooterComponent={() => <View style={{ height: 90 }} />}
        ListEmptyComponent={() => (
          <View style={styles.noListingsText}>
            <AppText>Sorry nothing to show..</AppText>
          </View>
        )}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  categoriesContainer: {
    // paddingHorizontal: 10,
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
  },
  screenHeaderText: {
    fontWeight: "bold",
    fontSize: 30,
    textAlignVertical: "bottom",
    color: colors.mediumRare,
  },
  sortModal: {
    justifyContent: "flex-end",
  },
});

export default Listings;
