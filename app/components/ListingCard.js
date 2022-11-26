import {
  ImageBackground,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { Component } from "react";

import AppText from "./Text";
import Icon from "./Icon";
import colors from "../config/colors";
import { currencyFormatter } from "../utility/numberFormat";
import moment from "../../node_modules/moment/moment";
import routes from "../navigation/routes";

const ListingCard = ({ navigation, item }) => {
  return (
    <TouchableWithoutFeedback
      onPress={() =>
        navigation.navigate(routes.LISTING_DETAILS, {
          item: item,
        })
      }
    >
      <View
        style={{
          height: 150,
          alignItems: "flex-start",
          justifyContent: "flex-start",
          borderRadius: 10,
          borderColor: "#0000",
          backgroundColor: "#fff",
          flexDirection: "row",
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
            width: "100%",
          }}
        >
          <View>
            <AppText
              numberOfLines={1}
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#5d5d5d",
              }}
            >
              {item.title}
            </AppText>
            <View style={{ alignItems: "flex-end", marginVertical: 5 }}>
              <Icon
                name='heart-outline'
                circle={false}
                backgroundColor={colors.invisible}
                iconColor={colors.mediumRare}
                size={30}
              />
            </View>
            <View>
              <AppText numberOfLines={2} style={{ color: "#5d5d5d" }}>
                {item.description}
              </AppText>
            </View>
          </View>

          <View
            style={{
              justifyContent: "flex-end",
              flex: 1,
              width: "100%",
              marginBottom: 7,
            }}
          >
            <AppText
              style={{
                fontSize: 14,
                fontWeight: "bold",
                textDecorationLine: "line-through",
                textDecorationStyle: "solid",
                color: colors.secondary,
              }}
            >
              {item.promotionPrice && currencyFormatter(item.price)}
            </AppText>
            <View
              style={{
                flexDirection: "row",
                // flex: 1,
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <AppText
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: colors.primary,
                }}
              >
                {item.promotionPrice
                  ? currencyFormatter(item.promotionPrice)
                  : currencyFormatter(parseInt(item.price))}
              </AppText>
              <AppText
                style={{
                  fontSize: 12,
                  color: colors.secondary,
                  textAlignVertical: "bottom",
                }}
              >
                {moment(item.createdAt).fromNow()}
              </AppText>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ListingCard;
