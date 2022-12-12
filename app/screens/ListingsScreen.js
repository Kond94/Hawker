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
import { getCategories, getListings } from "../utility/fireStore";

import { Animations } from "../config/Animations";
import AppText from "../components/Text";
import AppTextInput from "../components/TextInput";
import BannerIcon from "../components/BannerIcon";
import Icon from "../components/Icon";
import { ListItem } from "../components/ListItem";
import Modal from "react-native-modal";
import Screen from "../components/Screen";
import SortModal from "../components/SortModal";
import colors from "../config/colors";

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
    min: new Date(2022, 0, 1),
    max: new Date(),
  });

  useEffect(() => {
    const listingsSubscriber = getListings(
      setListings,
      setFilteredListings,
      setLoading,
      sort
    );

    const categoriesSubscriber = getCategories(setCategories);

    const unsubscribe = navigation.addListener("focus", () => {
      viewRef.current.animate({ 0: { opacity: 0.5 }, 1: { opacity: 1 } });
    });
    // ToastAndroid.show(animation+ ' Animation', ToastAndroid.SHORT);
    return () => unsubscribe, listingsSubscriber, categoriesSubscriber;
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
      0.5: { translateY: 50 },
      1: { translateY: 0 },
    };
    return (
      <View style={[styles.listEmpty]}>
        <Animatable.Text
          animation={anim}
          easing='ease-in-out'
          duration={2000}
          style={{ fontSize: 24 }}
          iterationCount='infinite'
        >
          Nothing here unfortunately :(
        </Animatable.Text>
      </View>
    );
  };

  //Helper Methods

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
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
        onSwipeComplete={() => setModalVisible(false)}
        swipeDirection={["down"]}
        style={{
          justifyContent: "flex-end",
          margin: 0,
        }}
      >
        <SortModal sort={sort} setSort={setSort} toggleModal={toggleModal} />
      </Modal>
      {/* <Modal
        style={styles.sortModal}
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        animationInTiming={400}
        animationOutTiming={500}
      >
       
        <SortModal
          sort={sort}
          setSort={setSort}
          toggleModal={toggleModal}
        />
      </Modal> */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
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
              toggleModal();
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
          ListHeaderComponent={() => (
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
          )}
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
  screenHeaderText: {
    fontWeight: "bold",
    fontSize: 25,
    textAlignVertical: "bottom",
    color: colors.mediumRare,
    marginHorizontal: 10,
  },
  sortModal: {
    justifyContent: "flex-end",
  },
});
