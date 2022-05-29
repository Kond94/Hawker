import * as Yup from "yup";

import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from "../components/forms";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import ActivityIndicator from "../components/ActivityIndicator";
import FormCheckBox from "../components/forms/FormCheckBox";
import ImageBackground from "react-native/Libraries/Image/ImageBackground";
import ImageInput from "../components/ImageInput";
import Screen from "../components/Screen";
import StoreForm from "../components/forms/StoreForm";
import Text from "../components/Text";
import UploadFile from "../utility/uploadFile";
import UploadScreen from "./UploadScreen";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

const validationSchema = Yup.object().shape({
  username: Yup.string().required().label("Username"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
  hasStore: Yup.boolean().required(),
});

function RegisterScreen() {
  const [profilePhotoURL, setProfilePhotoURL] = useState(null);
  const [storePhotoURL, setStorePhotoURL] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  async function uploadProfilePhoto(uri) {
    if (uri === null) return setProfilePhotoURL(null);
    setProfilePhotoURL(await UploadFile(uri, setIsUploading));
  }

  async function uploadStorePhoto(uri) {
    if (uri === null) return setStorePhotoURL(null);
    setStorePhotoURL(await UploadFile(uri, setIsUploading));
  }

  const onHandleSignup = async ({
    email,
    password,
    username,
    hasStore,
    storeName,
    storeDescription,
  }) => {
    try {
      var uid = "";
      if (email !== "" && password !== "") {
        setLoading(true);

        await auth()
          .createUserWithEmailAndPassword(email, password)
          .then((res) => {
            uid = res.user.uid;
            res.user
              .updateProfile({
                displayName: username,
                photoURL: profilePhotoURL,
              })
              .then((res) => {
                firestore()
                  .collection("Users")
                  .doc(uid)
                  .set({
                    name: username,
                    email: email,
                    hasStore: hasStore,
                    photoURL: profilePhotoURL ? profilePhotoURL : "",
                  });

                if (hasStore)
                  firestore()
                    .collection("Stores")
                    .add({
                      storeName,
                      storeDescription,
                      storeLogo: storePhotoURL ? storePhotoURL : "",
                      storeOwner: uid,
                    });
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
      <ImageBackground
        blurRadius={0.5}
        style={{ flex: 1 }}
        source={require("../assets/app-background.png")}
      >
        <UploadScreen progress={0} onDone={() => {}} visible={isUploading} />
        {loading && <ActivityIndicator visible={loading} />}
        <Screen style={styles.container}>
          <ScrollView>
            <Text style={styles.heading}>
              Tap the
              {profilePhotoURL
                ? " Image to change it"
                : " Icons below to upload a display picture"}
            </Text>
            <View
              style={{
                alignSelf: "center",
                alignItems: "center",
                justifyContent: "center",
                height: 120,
                borderRadius: 75,
              }}
            >
              <ImageInput
                imageURI={profilePhotoURL}
                setImageURI={uploadProfilePhoto}
              />
            </View>

            <Form
              initialValues={{
                username: "",
                email: "",
                password: "",
                hasStore: false,
              }}
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
              <FormCheckBox name='hasStore' text='I have a Store/Brand' />

              <StoreForm>
                <Text style={styles.heading}>
                  Tap the
                  {storePhotoURL
                    ? " Logo to change it"
                    : " Icons below to upload your store's Logo"}
                </Text>
                <View
                  style={{
                    alignSelf: "center",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 120,
                    borderRadius: 75,
                  }}
                >
                  <ImageInput
                    imageURI={storePhotoURL}
                    setImageURI={uploadStorePhoto}
                  />
                </View>
                <FormField
                  autoCorrect={false}
                  icon='store'
                  name='storeName'
                  placeholder='Store Name'
                />
                <FormField
                  maxLength={255}
                  multiline
                  name='storeDescription'
                  numberOfLines={3}
                  placeholder='Store Description'
                />
              </StoreForm>
              <SubmitButton title='Register' />
            </Form>
          </ScrollView>
        </Screen>
      </ImageBackground>
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
