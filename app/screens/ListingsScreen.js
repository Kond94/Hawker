import { FlatList, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";

import ActivityIndicator from "../components/ActivityIndicator";
import AppText from "../components/Text";
import AppTextInput from "../components/TextInput";
import { BlurView } from "expo-blur";
import Button from "../components/Button";
import Card from "../components/Card";
import ImageBackground from "react-native/Libraries/Image/ImageBackground";
import Info from "../components/Info";
import Screen from "../components/Screen";
import SelectBox from "react-native-multi-selectbox";
import auth from "@react-native-firebase/auth";
import colors from "../config/colors";
import firestore from "@react-native-firebase/firestore";
import routes from "../navigation/routes";
import { xorBy } from "lodash";

function ListingsScreen({ navigation }) {
  const [searchText, setSearchText] = useState("");
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const categoriesSubscriber = firestore()
      .collection("Categories")
      .onSnapshot((querySnapShot) => {
        const categories = [];
        querySnapShot.forEach(async (item) => {
          const category = {
            id: item.id,
            label: item.data().label,
            item: item.data().label,
            icon: item.data().icon,
            backgroundColor: item.data().backgroundColor,
          };
          categories.push(category);
          setCategories(categories);
        });
      });

    const subscriber = firestore()
      .collection("Listings")
      .orderBy("title", "desc")

      .onSnapshot((querySnapShot) => {
        const listings = [];
        querySnapShot.forEach((item) => {
          listings.push({ id: item.id, ...item.data() });
        });
        setListings(listings);
        setFilteredListings(searchText);
        setLoading(false);
      });

    // Unsubscribe from events when no longer in use
    return () => {
      return subscriber(), categoriesSubscriber(); // This worked for me
    };
  }, []);

  const searchListings = (searchText) => {
    let filteredListings = listings?.filter(
      (listing) =>
        listing.title.toLowerCase().includes(searchText.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredListings(filteredListings);
  };

  const handleSignOut = async () => {
    auth()
      .signOut()
      .then(() => console.log("User signed out!"));
  };

  const onMultiChange = (item) => {
    setSelectedCategories(xorBy(selectedCategories, [item], "id"));
  };
  return (
    <>
      <ImageBackground
        blurRadius={0.5}
        style={{ flex: 1 }}
        source={require("../assets/app-background.png")}
      >
        <ActivityIndicator visible={false} />

        <Screen style={styles.screen}>
          {false && (
            <>
              <AppText>Couldn't retrieve the listings.</AppText>
              <Button title='Retry' onPress={() => {}} />
            </>
          )}
          <BlurView
            intensity={100}
            style={{
              alignItems: "center",
              backgroundColor: "white",
              flexDirection: "row",
              justifyContent: "center",
              marginHorizontal: 10,
            }}
          >
            <View style={{ flex: 1 }}>
              <AppTextInput
                placeholder='Search Hawker'
                onChangeText={searchListings}
              />
            </View>
          </BlurView>
          <FlatList
            ListHeaderComponent={
              () => (
                <>
                  {auth().currentUser?.isAnonymous ? (
                    <Info
                      information='Sign in to be able to buy & sell. We will also be able to personalize your experience'
                      buttonTitle='Sign In'
                      onButtonPress={handleSignOut}
                    />
                  ) : (
                    <></>
                  )}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      margin: 17,
                    }}
                  >
                    <SelectBox
                      label='Filter'
                      labelStyle={{ fontSize: 15, color: colors.secondary }}
                      options={categories}
                      selectedValues={selectedCategories}
                      onMultiSelect={onMultiChange}
                      onTapClose={onMultiChange}
                      isMulti
                      multiOptionContainerStyle={{ margin: 5 }}
                    />
                  </View>
                </>
              )
              // <View style={{ marginVertical: 5 }}>
              //   <AppText style={{ textAlign: "center" }}>
              //     Sign in to be able to buy & sell. We will also be able to
              //     personalize your experience
              //   </AppText>
              //   <View
              //     style={{ flexDirection: "row", justifyContent: "center" }}
              //   >
              //     <AppButton
              //       title={"sign in"}
              //       width='35%'
              //       margin={10}
              //       color='secondary'
              //       onPress={() => navigation.dispatch.toggleDrawer()}
              //     />
              //   </View>
              // </View>
            }
            style={{ marginTop: 10 }}
            showsVerticalScrollIndicator={false}
            data={filteredListings ? filteredListings : listings}
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
