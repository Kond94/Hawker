import { StyleSheet, View } from "react-native";

import Checkbox from "expo-checkbox";
import React from "react";
import Text from "./Text";
import colors from "../config/colors";

function CheckBox({ value, onValueChanged, text }) {
  return (
    <View style={styles.container}>
      <Checkbox
        style={styles.checkbox}
        value={value}
        onValueChange={onValueChanged}
        color={colors.primary}
      />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },

  checkbox: {
    margin: 10,
  },
  text: {
    padding: 20,
  },
});

export default CheckBox;
