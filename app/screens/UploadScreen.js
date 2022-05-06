import * as Progress from "react-native-progress";

import { Modal, StyleSheet, View } from "react-native";

import AppText from "../components/Text";
import LottieView from "lottie-react-native";
import React from "react";
import colors from "../config/colors";

function UploadScreen({ onDone, progress = 0, visible = false }) {
  return (
    <Modal visible={visible}>
      <View style={styles.container}>
        {progress < 1 ? (
          <>
            <LottieView
              autoPlay
              loop={true}
              onAnimationFinish={onDone}
              source={require("../assets/animations/uploading.json")}
              style={styles.animation}
            />
            <AppText>Uploading...</AppText>
          </>
        ) : (
          <LottieView
            autoPlay
            loop={false}
            onAnimationFinish={onDone}
            source={require("../assets/animations/done.json")}
            style={styles.animation}
          />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  animation: {
    width: 150,
  },
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});

export default UploadScreen;
