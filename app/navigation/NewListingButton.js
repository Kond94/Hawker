import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import colors from "../config/colors";

function NewListingButton({ onPress }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
        <MaterialCommunityIcons
          name='plus-circle'
          color={colors.white}
          size={40}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderColor: colors.white,
    borderRadius: 40,
    bottom: 13,
    height: 60,
    justifyContent: "center",
    width: 60,
  },
});

export default NewListingButton;
