import * as Animatable from "react-native-animatable";

import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import FastImage from "react-native-fast-image";
import Icon from "./Icon";
import React from "react";
import colorAr from "../config/styles";
import colors from "../config/colors";
import { currencyFormatter } from "../utility/numberFormat";
import routes from "../navigation/routes";

export function ListItem({ item, index, animation, navigation }) {
  const bgColor = (i) => colorAr[i % colorAr.length];

  return (
    <Animatable.View animation={animation} duration={1000} delay={index * 300}>
      <View style={styles.listItem}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            navigation.navigate(routes.LISTING_DETAILS, {
              listingId: item.id,
              listingAuthor: item.author,
            })
          }
        >
          <FastImage
            source={{ uri: item.images[0] }}
            cacheKey={item.id} // could be a unque id
            style={{ ...styles.image, backgroundColor: bgColor(index) }} // your custom style object
          />
        </TouchableOpacity>

        <View style={styles.detailsContainer}>
          <View
            style={{
              marginTop: -85,
              backgroundColor: colors.medium,
              // width: "60%",
              height: 30,
              borderRadius: 20,
              justifyContent: "center",
              // alignItems: "flex-end",
              padding: 5,
            }}
          >
            <Text style={{ fontWeight: "600" }}>
              {currencyFormatter(item.price)}
            </Text>
          </View>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.name}>{item.title}</Text>
        </View>
      </View>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  listItem: {
    height: 200,
    width: Dimensions.get("window").width / 2 - 16,
    backgroundColor: "white",
    margin: 8,
    borderRadius: 10,
  },
  image: {
    height: 150,
    margin: 5,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    color: "black",
  },
  detailsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
