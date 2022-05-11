import { StyleSheet, View } from "react-native";

import AppText from "./Text";
import LottieView from "lottie-react-native";
import React from "react";

function ActivityIndicator({ visible = false }) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <LottieView
        style={{ width: 100, height: 100 }}
        autoPlay
        loop
        source={require("../assets/animations/loading.json")}
      />
      <AppText>Retrieving</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    backgroundColor: "transparent",
    height: "100%",
    width: "100%",
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ActivityIndicator;
