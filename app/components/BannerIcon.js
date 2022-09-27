import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import AppText from "./Text";
import Icon from "./Icon";
import colors from "../config/colors";

const BannerIcon = ({ item, selectedItems, filter, sort }) => {
  return (
    <View
      key={item.id}
      style={{
        marginVertical: 10,
        marginRight: 33,
        marginBottom: 2,
        alignItems: "center",
      }}
    >
      <View
        style={[
          styles.categoryIcon,
          {
            backgroundColor: selectedItems.includes(item)
              ? colors.primary
              : colors.medium,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            filter(item);
            // sort();
          }}
        >
          <Icon
            size={60}
            name={item.icon}
            circle={false}
            backgroundColor={colors.invisible}
            iconColor={colors.mediumRare}
          />
        </TouchableOpacity>
      </View>
      <AppText style={styles.categoryLabel}>{item.label}</AppText>
    </View>
  );
};
const styles = StyleSheet.create({
  categoryIcon: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,

    shadowColor: colors.dark,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 5,
  },
  categoryLabel: { color: colors.mediumRare },
});
export default BannerIcon;
