import { SafeAreaView, StyleSheet, View } from "react-native";

import React from "react";

function Screen({ children, style }) {
  return (
    <SafeAreaView style={[styles.screen, style]}>
      <View style={[styles.view, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  view: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 13,
    paddingHorizontal: 10,
  },
});

export default Screen;
