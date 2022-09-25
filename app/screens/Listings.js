import {
  FlatList,
  ImageBackground,
  LogBox,
  StyleSheet,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getCategories, getListings } from "../utility/fireStore";

import AppText from "../components/Text";
import AppTextInput from "../components/TextInput";
import Icon from "../components/Icon";
import Screen from "../components/Screen";
import colors from "../config/colors";
import { currencyFormatter } from "../utility/numberFormat";

const Listings = ({ navigation, route }) => {
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
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

  // return <Routes />;
  return (
    <Screen>
      <View style={styles.header}>
        <Icon
          name='menu'
          backgroundColor='#0000'
          iconColor='#000'
          circle={false}
        />
        <AppText style={styles.headerTitle}>Listings</AppText>
        <Icon
          name='filter-remove'
          backgroundColor='#0000'
          iconColor={colors.mediumRare}
          circle={false}
        />
      </View>
      <View style={styles.searchBox}>
        <AppTextInput placeholder='Search Listings' />
      </View>
      <View style={styles.categoriesContainer}>
        <View style={styles.categoriesHeader}>
          <AppText style={{ fontWeight: "bold", color: colors.mediumRare }}>
            Category
          </AppText>
          <AppText style={{ fontWeight: "bold", color: colors.mediumRare }}>
            See All
          </AppText>
        </View>
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={categories}
          horizontal
          renderItem={({ item }) => (
            <View
              key={item.id}
              style={{
                margin: 10,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 50,
                  height: 50,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 5,
                  backgroundColor: item.selected
                    ? colors.primary
                    : colors.medium,
                  shadowColor: colors.dark,
                  shadowOffset: { width: 2, height: 2 },
                  shadowOpacity: 1,
                  shadowRadius: 10,
                  elevation: 5,
                  marginBottom: 5,
                  // background color must be set
                }}
              >
                <Icon
                  size={60}
                  name={item.icon}
                  circle={false}
                  backgroundColor={colors.invisible}
                  iconColor={colors.mediumRare}
                />
              </View>
              <AppText style={{ color: colors.mediumRare }}>
                {item.label}
              </AppText>
            </View>
          )}
        />
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={listings}
        renderItem={({ item }) => (
          <View
            style={{
              margin: 5,
              alignItems: "center",
            }}
          >
            {console.log(item)}
            <View
              style={{
                width: "100%",
                height: 130,
                alignItems: "flex-start",
                justifyContent: "flex-start",
                borderRadius: 10,
                borderColor: "#0000",
                backgroundColor: "#fff",
                marginBottom: 5,
                flexDirection: "row",
                shadowColor: colors.mediumRare,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 1,
                shadowRadius: 0,
                elevation: 3,
              }}
            >
              <View
                style={{
                  width: "40%",
                  borderRadius: 10,
                  height: "100%",
                  overflow: "hidden",
                }}
              >
                <ImageBackground
                  resizeMode='cover'
                  source={{ uri: item.images[0] }}
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#000",
                    shadowColor: colors.dark,
                    shadowOffset: { width: 5, height: 5 },
                    shadowOpacity: 1,
                    shadowRadius: 10,
                    elevation: 5,
                  }}
                />
              </View>
              <View
                style={{
                  marginLeft: 10,
                  marginRight: 3,
                  flexShrink: 1,
                }}
              >
                <AppText
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "#5d5d5d",
                  }}
                >
                  {item.title}
                </AppText>
                <AppText numberOfLines={2} style={{ color: "#5d5d5d" }}>
                  {item.description}
                </AppText>
                <View
                  style={{
                    justifyContent: "flex-end",
                    flex: 1,
                    marginBottom: 7,
                  }}
                >
                  <AppText
                    style={{
                      fontSize: 13,
                      fontWeight: "bold",
                      textDecorationLine: "line-through",
                      textDecorationStyle: "solid",
                      color: colors.secondary,
                    }}
                  >
                    {item.promotionPrice && currencyFormatter(item.price)}
                  </AppText>
                  <AppText
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      color: colors.primary,
                    }}
                  >
                    {item.promotionPrice
                      ? currencyFormatter(item.promotionPrice)
                      : currencyFormatter(parseInt(item.price))}
                  </AppText>
                </View>
              </View>
            </View>
          </View>
        )}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  categoriesCard: {},
  categoriesContainer: {
    paddingHorizontal: 10,
  },
  categoriesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: colors.mediumRare,
  },
  searchBox: {
    alignItems: "center",
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
    margin: 5,
  },
});

export default Listings;
