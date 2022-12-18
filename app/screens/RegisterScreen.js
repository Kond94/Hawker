import * as Yup from "yup";

import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from "../components/forms";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import FormCheckBox from "../components/forms/FormCheckBox";
import ImageInput from "../components/ImageInput";
import LoadingIndicator from "../components/LoadingIndicator";
import Screen from "../components/Screen";
import StoreForm from "../components/forms/StoreForm";
import Text from "../components/Text";
import { UploadFile } from "../utility/uploadFile";
import { database } from "../config/firebase";

const validationSchema = Yup.object().shape({
  displayName: Yup.string().required().label("Display Name"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
  hasStore: Yup.boolean().required(),
});

function RegisterScreen() {
  const auth = getAuth();
  const [profilePhotoURL, setProfilePhotoURL] = useState(null);
  const [storePhotoURL, setStorePhotoURL] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  async function uploadProfilePhoto(uri) {
    if (uri === null) return setProfilePhotoURL(null);
    setProfilePhotoURL(await UploadFile(uri, "/Profile_Photos/"));
  }

  async function uploadStorePhoto(uri) {
    if (uri === null) return setStorePhotoURL(null);
    setStorePhotoURL(await UploadFile(uri, "/Store_Photos/"));
  }

  const onHandleSignup = async ({
    email,
    password,
    displayName,
    hasStore,
    storeName,
    storeDescription,
  }) => {
    try {
      var uid = "";
      if (email !== "" && password !== "") {
        setLoading(true);

        createUserWithEmailAndPassword(auth, email, password).then((res) => {
          updateProfile(auth.currentUser, {
            photoURL: profilePhotoURL,
            displayName: displayName,
          }).then((res) => {
            setDoc(doc(database, "Users", auth.currentUser.uid), {
              displayName: displayName,
              email: email,
              hasStore: hasStore,
              photoURL: profilePhotoURL ? profilePhotoURL : "",
            });

            if (hasStore)
              setDoc(doc(database, "Stores"), {
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
    <Screen>
      {loading && <LoadingIndicator />}
      {isUploading && <LoadingIndicator />}
      <ScrollView style={{ flex: 1 }}>
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
            displayName: "",
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
            name='displayName'
            placeholder='Display Name'
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
  );
}

const styles = StyleSheet.create({
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
