import {
  Card,
  CardAction,
  CardButton,
  CardContent,
  CardImage,
  CardTitle,
} from "react-native-cards";
import { FlatList, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { appUser, signOut } from "../utility/auth";
import { getCategories, getStores } from "../utility/fireStore";

import InfoWithAction from "../components/InfoWithAction";
import colors from "../config/colors";
import routes from "../navigation/routes";

const StoreScreen = ({ navigation }) => {
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const storesSubscriber = getStores(setStores);

    const categoriesSubscriber = getCategories(setCategories);

    // Unsubscribe from events when no longer in use
    return storesSubscriber, categoriesSubscriber;
  }, []);
  return (
    <FlatList
      ListHeaderComponent={() =>
        appUser().isAnonymous ? (
          <InfoWithAction onButtonPress={signOut} />
        ) : (
          <></>
        )
      }
      showsVerticalScrollIndicator={false}
      data={stores}
      keyExtractor={(store) => store.id.toString()}
      renderItem={({ item }) => {
        return (
          // TODO: Store Details Screen
          <Card>
            <CardImage
              source={{ uri: item.storeBackground }}
              title={item.storeName}
            />
            <CardTitle subtitle={item.storeDescription} />
            <CardContent text={item.storeLocation} />
            <CardContent text='Stockists of: Shoes, Shirts, Socks' />
            <CardAction separator={true} inColumn={false}>
              {/* <CardButton
                onPress={() => {}}
                title='Share'
                color={colors.secondary}
              /> */}
              <CardButton
                onPress={() =>
                  navigation.navigate(routes.STORE_LANDING, {
                    storeId: item.id,
                  })
                }
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
