import { StyleSheet, Text, TouchableOpacity } from "react-native";

import React from "react";
import colors from "../config/colors";

function AppButton({
  title,
  onPress,
  color = "primary",
  width = "100%",
  margin = 0,
}) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors[color], width, margin }]}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    width: "100%",
    marginVertical: 10,
  },
  text: {
    color: colors.white,
    fontSize: 18,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});

export default AppButton;
