import * as Animatable from "react-native-animatable";

import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import colors from "../config/colors";

export default function ColorScreen({ route, navigation, children }) {
  const viewRef = React.useRef(null);
  const [bgColor, setBgColor] = useState();
  useEffect(() => {
    switch (route.name) {
      case "Home": {
        setBgColor(colors.primary);
        break;
      }
      case "Search": {
        setBgColor(colors.green);
        break;
      }
      case "Add": {
        setBgColor(colors.red);
        break;
      }
      case "Account": {
        setBgColor(colors.purple);
        break;
      }
      case "Like": {
        setBgColor(colors.yellow);
        break;
      }
      default:
        setBgColor(colors.white);
    }
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      viewRef.current.animate({ 0: { opacity: 0.5 }, 1: { opacity: 1 } });
    });
    return () => unsubscribe;
  }, [navigation]);
  return (
    <SafeAreaView style={styles.container}>
      <Animatable.View
        ref={viewRef}
        easing={"ease-in-out"}
        style={styles.container}
      >
        <View style={{ backgroundColor: bgColor, flex: 1 }}>{children}</View>
      </Animatable.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
});
