import React, { Component } from "react";

import AppButton from "./Button";
import AppText from "./Text";
import { View } from "react-native";

const Info = ({ information, buttonTitle, onButtonPress }) => {
  return (
    <View style={{ margin: 10 }}>
      <AppText style={{ textAlign: "center" }}>{information}</AppText>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <AppButton
          title={"sign in"}
          width='35%'
          margin={10}
          color='secondary'
          onPress={onButtonPress}
        />
      </View>
    </View>
  );
};

export default Info;
