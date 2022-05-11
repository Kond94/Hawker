import * as Yup from "yup";

import {
  Form,
  FormField,
  FormPicker as Picker,
  SubmitButton,
} from "../components/forms";
import React, { useContext, useEffect, useState } from "react";

import ActivityIndicator from "../components/ActivityIndicator";
import { AuthenticatedUserContext } from "../auth/AuthenticatedUserProvider";
import CategoryPickerItem from "../components/CategoryPickerItem";
import FormImagePicker from "../components/forms/FormImagePicker";
import ImageBackground from "react-native/Libraries/Image/ImageBackground";
import Screen from "../components/Screen";
import { StyleSheet } from "react-native";
import UploadFile from "../utility/uploadFile";
import UploadScreen from "./UploadScreen";
import UserNotLoggedIn from "../components/UserNotLoggedIn";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

const validationSchema = Yup.object().shape({
  title: Yup.string().required().min(1).label("Title"),
  price: Yup.number().required().min(1).max(10000).label("Price"),
  description: Yup.string().label("Description"),
  category: Yup.object().required().nullable().label("Category"),
  images: Yup.array().min(1, "Please select at least one image."),
});

function ListingEditScreen() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const user = auth().currentUser;

  useEffect(() => {
    const subscriber = firestore()
      .collection("Categories")
      .onSnapshot((querySnapShot) => {
        const categories = [];
        querySnapShot.forEach(async (item) => {
          const category = {
            id: item.id,
            label: item.data().label,
            icon: item.data().icon,
            backgroundColor: item.data().backgroundColor,
          };
          categories.push(category);
          setCategories(categories);
        });
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  const handleSubmit = async (listing, { resetForm }) => {
    const imageURLs = [];
    for (const image of listing.images) {
      imageURLs.push(await UploadFile(image, setIsUploading));
    }

    setLoading(true);
    const timestamp = firestore.FieldValue.serverTimestamp;

    await firestore()
      .collection("Listings")
      .add({
        title: listing.title,
        price: listing.price,
        description: listing.description,
        category: listing.category.id,
        images: imageURLs,
        author: user.uid,
        createdAt: timestamp(),
      })
      .then(() => {
        console.log("Listing added!");
        resetForm();
        setLoading(false);
      });
  };
  const handleSignOut = async () => {
    auth()
      .signOut()
      .then(() => console.log("User signed out!"));
  };
  return (
    <ImageBackground
      blurRadius={0.5}
      style={{ flex: 1 }}
      source={require("../assets/app-background.png")}
    >
      {loading && <ActivityIndicator visible={loading} />}
      <Screen style={styles.container}>
        <UploadScreen
          progress={uploadProgress}
          onDone={() => setLoading(false)}
          visible={isUploading}
        />
        {auth().currentUser?.isAnonymous ? (
          <UserNotLoggedIn
            information='Please sign in to post and edit your listings and stores'
            buttonTitle='Sign In'
            onButtonPress={handleSignOut}
          />
        ) : (
          <Form
            initialValues={{
              title: "",
              price: "",
              description: "",
              category: null,
              images: [],
            }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            <FormImagePicker name='images' />
            <FormField maxLength={255} name='title' placeholder='Title' />
            <FormField
              keyboardType='numeric'
              maxLength={8}
              name='price'
              placeholder='Price'
              width={120}
            />
            <Picker
              items={categories}
              name='category'
              numberOfColumns={3}
              PickerItemComponent={CategoryPickerItem}
              placeholder='Category'
              width='50%'
            />
            <FormField
              maxLength={255}
              multiline
              name='description'
              numberOfLines={3}
              placeholder='Description'
            />
            <SubmitButton title='Post' />
          </Form>
        )}
      </Screen>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "transparent",
  },
});
export default ListingEditScreen;
