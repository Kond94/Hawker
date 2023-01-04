import {
  ImageBackground,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { Component } from "react";

import AppButton from "./Button";
import AppText from "./Text";
import Icon from "./Icon";
import colors from "../config/colors";
import { currencyFormatter } from "../utility/numberFormat";
import moment from "../../node_modules/moment/moment";
import routes from "../navigation/routes";

const ListingCard = ({ navigation, item, editable }) => {
  return (
    <TouchableWithoutFeedback
      onPress={() =>
        navigation.navigate(routes.LISTING_DETAILS, {
          listingId: item.id,
          listingAuthor: item.author,
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
          margin: 5,
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

            <View>
              <AppText numberOfLines={2} style={{ color: "#5d5d5d" }}>
                {item.description}
              </AppText>
              {editable && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                  }}
                >
                  <TouchableOpacity onPress={() => editable.onEdit(item)}>
                    <Icon
                      name='note-edit-outline'
                      backgroundColor='#0000'
                      iconColor={colors.secondary}
                      circle={false}
                      size={50}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => editable.onDelete(item)}>
                    <Icon
                      name='delete'
                      backgroundColor='#0000'
                      iconColor={colors.red}
                      circle={false}
                      size={50}
                    />
                  </TouchableOpacity>
                </View>
              )}
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
