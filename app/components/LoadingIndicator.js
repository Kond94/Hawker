import { StyleSheet, View } from "react-native";

import AppText from "./Text";
import { MotiView } from "moti";
import React from "react";

const LoadingIndicator = ({ size = 25, text = "Loading" }) => {
  return (
    <View style={styles.overlay}>
      <MotiView
        from={{
          width: size,
          height: size,
          borderWidth: 2,
          borderRadius: size / 2,
          shadowOpacity: 0.5,
          elevation: 0,
        }}
        animate={{
          width: size + 10,
          height: size + 10,
          borderRadius: (size + 15) / 2,
          borderWidth: size / 8,
          shadowOpacity: 1,
          elevation: 3,
        }}
        transition={{
          type: "timing",
          duration: 1000,
          repeat: Infinity,
        }}
        style={{
          marginVertical: 5,
          width: size,
          height: size,
          borderradius: size / 2,
          borderWidth: size / 8,
          borderColor: "#118DD0",
          shadowColor: "#EE2F75",
          shadowOffset: { width: 2, height: 2 },
          shadowOpacity: 1,
          shadowRadius: 10,
          elevation: 5,
          // background color must be set
          backgroundColor: "#fff",
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    backgroundColor: "rgba(52, 52, 52, 0.2)",
    flex: 1,
    height: "100%",
    width: "100%",
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
export default LoadingIndicator;
