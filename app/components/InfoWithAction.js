import React, { Component } from "react";

import AppButton from "./Button";
import AppText from "./Text";
import { View } from "react-native";

const InfoWithAction = ({
  information = "  Sign in to be able to buy & sell. We will also be able to personalizeyour experience",
  buttonTitle = "sign in",
  onButtonPress,
}) => {
  return (
    <View style={{ margin: 10 }}>
      <AppText style={{ textAlign: "center" }}>{information}</AppText>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <AppButton
          title={buttonTitle}
          width='30%'
          margin={10}
          color='secondary'
          onPress={onButtonPress}
        />
      </View>
    </View>
  );
};

export default InfoWithAction;
