import {
  Card,
  CardAction,
  CardButton,
  CardContent,
  CardImage,
  CardTitle,
} from "react-native-cards";
import { FlatList, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { appUser, signOut } from "../utility/auth";
import { categoriesCollection, storesCollection } from "../utility/fireStore";

import SelectBox from "react-native-multi-selectbox";
import UserNotLoggedIn from "../components/UserNotLoggedIn";
import colors from "../config/colors";

const StoreScreen = () => {
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const onFilterChange = (item) => {
    setSelectedCategories(xorBy(selectedCategories, [item], "id"));
  };

  useEffect(() => {
    const storesSubscriber = storesCollection(setStores);

    const categoriesSubscriber = categoriesCollection(setCategories);

    // Unsubscribe from events when no longer in use
    return () => {
      return storesSubscriber(), categoriesSubscriber();
    };
  }, []);
  return (
    <FlatList
      ListHeaderComponent={() => (
        <>
          {appUser.isAnonymous ? (
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
              <CardButton
                onPress={() => {}}
                title='Share'
                color={colors.secondary}
              />
              <CardButton
                onPress={() => {}}
                title='Explore'
                color={colors.secondary}
              />
            </CardAction>
          </Card>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  filterBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 17,
  },
});

export default StoreScreen;
