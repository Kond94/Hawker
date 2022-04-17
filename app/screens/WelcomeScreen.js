import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";

import Button from "../components/Button";
import React from "react";
import routes from "../navigation/routes";

function WelcomeScreen({ navigation }) {
  return (
    <ImageBackground
      blurRadius={0.5}
      style={styles.background}
      source={require("../assets/app-background.png")}
    >
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require("../assets/logo-primary.png")}
        />
        {/* <Image
          resizeMethod='auto'
          style={styles.logo2}
          source={require("../assets/HAWKER.png")}
        /> */}

        <Text style={styles.tagline}>Sell or Buy</Text>
        <Text style={styles.tagline}>Anything from Anywhere!</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <Button
          title='Login'
          onPress={() => navigation.navigate(routes.LOGIN)}
        />
        <Button
          title='Register'
          color='secondary'
          onPress={() => navigation.navigate(routes.REGISTER)}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  buttonsContainer: {
    padding: 20,
    width: "100%",
  },
  logo: {
    width: 150,
    height: 150,
  },
  logo2: {
    width: "100%",
    height: 50,
  },
  logoContainer: {
    position: "absolute",
    top: 70,
    alignItems: "center",
  },
  tagline: {
    fontSize: 25,
    fontWeight: "600",
    paddingVertical: 10,
  },
});

export default WelcomeScreen;
