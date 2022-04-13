import React, { useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";
import Text from "../components/Text";
import Icon from "../components/Icon";

import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from "../components/forms";
import uploadImageFromDevice from "../utility/uploadImageFromDevice";
import getBlobFromUri from "../utility/getBlobFroUri";
import manageFileUpload from "../utility/manageFileUpload";
import ActivityIndicator from "../components/ActivityIndicator";
import Firebase from "../../config/firebase";
import { TouchableOpacity } from "react-native-gesture-handler";
import FastImage from "react-native-fast-image";

const usersCollection = Firebase.firestore().collection("Users");
const auth = Firebase.auth();
const firestore = Firebase.firestore();

const validationSchema = Yup.object().shape({
  username: Yup.string().required().label("Username"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});

function RegisterScreen() {
  const [imgURI, setImageURI] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [remoteURL, setRemoteURL] = useState("");

  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const handleLocalImageUpload = async () => {
    const fileURI = await uploadImageFromDevice();

    if (fileURI) {
      setImageURI(fileURI);
      console.log("here: ", imgURI);
    }

    await handleCloudImageUpload(fileURI);
  };
  const onStart = () => {
    setIsUploading(true);
  };

  const onProgress = (progress) => {
    setProgress(progress);
  };
  const onComplete = (fileUrl) => {
    setRemoteURL(fileUrl);
    setIsUploading(false);
    setImageURI(null);
  };

  const onFail = (error) => {
    setError(error);
    setIsUploading(false);
  };
  const handleCloudImageUpload = async (fileURI) => {
    if (!fileURI) return;

    const blob = await getBlobFromUri(fileURI);

    await manageFileUpload(blob, { onStart, onProgress, onComplete, onFail });
    console.log(remoteURL);
  };

  const onHandleSignup = async ({ email, password, username }) => {
    console.log(username);
    setLoading(true);
    try {
      if (email !== "" && password !== "") {
        await auth
          .createUserWithEmailAndPassword(email, password)
          .then((res) =>
            res.user.updateProfile({
              displayName: username,
              photoURL: remoteURL,
            })
          )
          .then((res) => {
            firestore
              .collection("Users")
              .add({
                name: username,
                email: email,
                photoURL: remoteURL,
              })
              .then(() => {
                console.log("User added!");
              });
          });
      }
    } catch (error) {
      setLoading(false);

      return setError(error.message);
    }
    setLoading(false);
  };

  return (
    <>
      <ActivityIndicator visible={loading} />
      <Screen style={styles.container}>
        <Text style={styles.heading}>
          Tap the{" "}
          {remoteURL
            ? "Image to change it"
            : "Icon below to upload your picture or logo"}
        </Text>
        <View
          style={{
            alignSelf: "center",
            width: 150,
            height: 150,
            borderRadius: 75,
          }}
        >
          {remoteURL ? (
            <TouchableOpacity onPress={handleLocalImageUpload}>
              <FastImage
                source={{ uri: remoteURL }}
                resizeMode='contain'
                style={{
                  alignSelf: "center",
                  width: 150,
                  height: 150,
                  borderRadius: 75,
                }}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleLocalImageUpload}>
              <Icon name='account' backgroundColor='silver' size={150} />
            </TouchableOpacity>
          )}
        </View>

        {isUploading ? (
          <View style={styles.uploadProgressContainer}>
            <Text> Upload {progress} of 100% </Text>
          </View>
        ) : (
          <></>
        )}

        <Form
          initialValues={{ username: "", email: "", password: "" }}
          onSubmit={onHandleSignup}
          validationSchema={validationSchema}
        >
          <ErrorMessage error={error} visible={error} />
          <FormField
            autoCorrect={false}
            icon='account'
            name='username'
            placeholder='Username'
          />
          <FormField
            autoCapitalize='none'
            autoCorrect={false}
            icon='email'
            keyboardType='email-address'
            name='email'
            placeholder='Email'
            textContentType='emailAddress'
          />
          <FormField
            autoCapitalize='none'
            autoCorrect={false}
            icon='lock'
            name='password'
            placeholder='Password'
            secureTextEntry
            textContentType='password'
          />
          <SubmitButton title='Register' />
        </Form>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  row: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
  },
  uploadProgressContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    margin: 10,
    fontSize: 15,
    fontWeight: "100",
    alignSelf: "center",
    textAlign: "center",
  },
});

export default RegisterScreen;
