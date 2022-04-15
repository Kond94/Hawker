import React from "react";
import { View, StyleSheet, Modal } from "react-native";
import * as Progress from "react-native-progress";
import LottieView from "lottie-react-native";

import colors from "../config/colors";
import AppText from "../components/Text";

function UploadScreen({ onDone, progress = 0, visible = false }) {
  return (
    <Modal visible={visible}>
      <View style={styles.container}>
        {progress === 0 ? (
          <>
            <AppText>Uploading...</AppText>
            <LottieView
              autoPlay
              loop={true}
              source={require("../assets/animations/uploading.json")}
              style={styles.animation}
            />
          </>
        ) : (
          <>
            <AppText>Successful</AppText>
            <LottieView
              autoPlay
              loop={false}
              onAnimationFinish={onDone}
              source={require("../assets/animations/done.json")}
              style={styles.animation}
            />
          </>
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
