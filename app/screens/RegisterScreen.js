import React, { useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";

import Screen from "../components/Screen";
import Text from "../components/Text";
import Icon from "../components/Icon";

import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from "../components/forms";
import ActivityIndicator from "../components/ActivityIndicator";
import Firebase from "../config/firebase";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import ImageInput from "../components/ImageInput";
import UploadScreen from "./UploadScreen";
const validationSchema = Yup.object().shape({
  username: Yup.string().required().label("Username"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});

function RegisterScreen() {
  const [remoteURL, setRemoteURL] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState();
  const [error, setError] = useState();

  async function uploadImageAsync(uri) {
    if (uri === null) return setRemoteURL(null);
    setIsUploading(true);
    setUploadProgress(0);
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const fileRef = ref(getStorage(), "/listing_images/" + uuidv4());

    const uploadTask = await uploadBytesResumable(fileRef, blob);
    // We're done with the blob, close and release it
    setUploadProgress(1);

    setRemoteURL(await getDownloadURL(fileRef));

    return setTimeout(() => setIsUploading(false), 500);
  }

  const onHandleSignup = async ({ email, password, username }) => {
    try {
      var uid = "";
      if (email !== "" && password !== "") {
        await Firebase.auth()
          .createUserWithEmailAndPassword(email, password)
          .then((res) => {
            uid = res.user.uid;
            res.user
              .updateProfile({
                displayName: username,
                photoURL: remoteURL,
              })
              .then((res) =>
                Firebase.firestore()
                  .collection("Users")
                  .doc(uid)
                  .set({
                    name: username,
                    email: email,
                    photoURL: remoteURL ? remoteURL : "",
                  })
              );
          });
      }
    } catch (error) {
      setLoading(false);

      return setError(error.message);
    }
  };

  return (
    <>
      <UploadScreen
        progress={uploadProgress}
        onDone={() => console.log("Done")}
        visible={isUploading}
      />
      <ActivityIndicator visible={false} />
      <Screen style={styles.container}>
        <Text style={styles.heading}>
          Tap the
          {remoteURL
            ? " Image to change it"
            : " Icon below to upload your picture or logo"}
        </Text>
        <View
          style={{
            alignSelf: "center",
            width: 150,
            height: 150,
            borderRadius: 75,
          }}
        >
          <ImageInput imageUri={remoteURL} onChangeImage={uploadImageAsync} />
        </View>

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
