import { StyleSheet, Text, TouchableOpacity } from "react-native";

import React from "react";
import colors from "../config/colors";

function AppButton({
  title,
  onPress,
  color = "primary",
  width = "100%",
  margin = 0,
  square = false,
  outline = false,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: outline ? "#0000" : colors[color],
          borderWidth: 1,
          borderColor: colors[color],
          width,
          margin,
          borderRadius: square ? 10 : 25,
        },
      ]}
      onPress={onPress}
    >
      <Text style={[styles.text, { color: outline ? colors[color] : "#fff" }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    width: "100%",
    marginVertical: 10,
  },
  text: {
    color: colors.white,
    fontSize: 15,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});

export default AppButton;
