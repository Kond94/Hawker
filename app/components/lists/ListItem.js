import { Image, StyleSheet, TouchableHighlight, View } from "react-native";

import FastImage from "react-native-fast-image";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import Swipeable from "react-native-gesture-handler/Swipeable";
import Text from "../Text";
import colors from "../../config/colors";

function ListItem({
  title,
  titleRight,
  subTitle,
  image,
  IconComponent,
  onPress,
  renderRightActions,
}) {
  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableHighlight underlayColor={colors.light} onPress={onPress}>
        <View style={styles.container}>
          {IconComponent}
          {image && <FastImage style={styles.image} source={{ uri: image }} />}
          <View style={styles.detailsContainer}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
              {titleRight && (
                <Text style={styles.titleRight}>{titleRight}</Text>
              )}
            </View>
            {subTitle && (
              <Text style={styles.subTitle} numberOfLines={2}>
                {subTitle}
              </Text>
            )}
          </View>
          <MaterialCommunityIcons
            color={colors.danger}
            name='chevron-right'
            size={25}
          />
        </View>
      </TouchableHighlight>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    padding: 15,
    backgroundColor: colors.white,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  subTitle: {
    color: colors.dark,
  },
  title: {
    fontWeight: "500",
  },
  titleRight: {
    fontSize: 11,
    color: colors.mediumRare,
  },
});

export default ListItem;
