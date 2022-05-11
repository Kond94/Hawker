import React, { Component } from "react";

import AppButton from "./Button";
import AppText from "./Text";
import { View } from "react-native";

const UserNotLoggedIn = ({ information, buttonTitle, onButtonPress }) => {
  return (
    <View style={{ margin: 10 }}>
      <AppText style={{ textAlign: "center" }}>
        Sign in to be able to buy & sell. We will also be able to personalize
        your experience
      </AppText>
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

export default UserNotLoggedIn;
