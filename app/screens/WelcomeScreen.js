import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from "react-native";

import AppText from "../components/Text";
import Button from "../components/Button";
import React from "react";
import Screen from "../components/Screen";
import auth from "@react-native-firebase/auth";
import colors from "../config/colors";
import routes from "../navigation/routes";

function WelcomeScreen({ navigation }) {
  return (
    <Screen>
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require("../assets/logo-primary.png")}
        />
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
      <View style={styles.skipLogin}>
        <TouchableNativeFeedback
          onPress={() => {
            auth()
              .signInAnonymously()
              .then((res) => {})
              .catch((error) => {
                if (error.code === "auth/operation-not-allowed") {
                  console.log("Enable anonymous in your firebase console.");
                }

                console.error(error);
              });
          }}
        >
          <View>
            <AppText style={{ color: colors.secondary }}>
              Just take me to the app
            </AppText>
          </View>
        </TouchableNativeFeedback>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  buttonsContainer: {
    padding: 20,
    width: "100%",
    alignItems: "center",
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
    marginTop: 70,
    alignItems: "center",
  },
  skipLogin: {
    marginVertical: 30,
    alignSelf: "center",
  },
  tagline: {
    fontSize: 22,
    fontWeight: "600",
    paddingVertical: 10,
  },
});

export default WelcomeScreen;
