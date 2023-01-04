import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";

function Icon({
  name,
  size = 35,
  backgroundColor = "#000",
  iconColor = "#fff",
  circle = true,
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: circle ? size / 2 : 0,
        backgroundColor,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <MaterialCommunityIcons name={name} color={iconColor} size={size * 0.6} />
    </View>
  );
}

export default Icon;
