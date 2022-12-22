import { Platform } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import colors from "./colors";

export default {
  colors,
  tabBarStyle: {
    height: 60,
    position: "absolute",
    bottom: 16,
    right: 16,
    left: 16,
    borderRadius: 16,
  },
  text: {
    color: colors.dark,
    fontSize: 14,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
  },
  Styles: StyleSheet.create({
    container: {
      flex: 1,
    },
    rowView: {
      flexDirection: "row",
      alignItems: "center",
    },
    separator: {
      height: 0.3,
      width: "100%",
      backgroundColor: colors.gray,
      opacity: 0.8,
    },
    boldText: {
      fontWeight: "bold",
    },
    contentContainerStyle: {
      paddingBottom: 200,
    },
    contentContainerStyle2: {
      paddingBottom: 100,
    },

    colorAr: [
      "#637aff",
      "#60c5a8",
      "#CCCCCC",
      "#ff5454",
      "#039a83",
      "#dcb834",
      "#8f06e4",
      "skyblue",
      "#ff4c98",
    ],
  }),
};
