import {
  Card,
  CardAction,
  CardButton,
  CardContent,
  CardImage,
  CardTitle,
} from "react-native-cards";
import { FlatList, View } from "react-native";
import React, { useEffect, useState } from "react";

import Info from "../components/Info";
import SelectBox from "react-native-multi-selectbox";
import auth from "@react-native-firebase/auth";
import colors from "../config/colors";
import firestore from "@react-native-firebase/firestore";

const StoreScreen = () => {
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleSignOut = async () => {
    auth()
      .signOut()
      .then(() => console.log("User signed out!"));
  };

  const onMultiChange = (item) => {
    setSelectedCategories(xorBy(selectedCategories, [item], "id"));
  };

  useEffect(() => {
    const storesSubscriber = firestore()
      .collection("Stores")
      .onSnapshot((querySnapShot) => {
        const stores = [];
        querySnapShot.forEach(async (item) => {
          const store = {
            id: item.id,
            storeName: item.data().storeName,
            storeDescription: item.data().storeDescription,
            storeProducts: item.data().storeProducts,
            storeLocation: item.data().storeLocation,
            storeOwner: item.data().storeOwner,
            storeLogo: item.data().storeLogo,
            storeBackground: item.data().storeBackground,
            storePrimaryColor: item.data().storePrimaryColor,
            storeSecondaryColor: item.data().storeSecondaryColor,
          };
          stores.push(store);
          setStores(stores);
        });
      });
    console.log(stores);

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

    // Unsubscribe from events when no longer in use

    // Unsubscribe from events when no longer in use
    return () => {
      return storesSubscriber(), categoriesSubscriber(); // This worked for me
    };
  }, []);
  return (
    <FlatList
      ListHeaderComponent={() => (
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
      )}
      style={{ marginTop: 10 }}
      showsVerticalScrollIndicator={false}
      data={stores}
      keyExtractor={(store) => store.id.toString()}
      renderItem={({ item }) => {
        return (
          <Card>
            <CardImage
              source={{ uri: item.storeBackground }}
              title={item.storeName}
            />
            <CardTitle subtitle={item.storeDescription} />
            <CardContent text={item.storeLocation} />
            <CardContent text='Stockists of: Shoes, Shirts, Socks' />
            <CardAction separator={true} inColumn={false}>
              <CardButton onPress={() => {}} title='Share' color='#FEB557' />
              <CardButton onPress={() => {}} title='Explore' color='#FEB557' />
            </CardAction>
          </Card>
        );
      }}
    />
  );
};

export default StoreScreen;
