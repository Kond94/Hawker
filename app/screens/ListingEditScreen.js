import * as Yup from "yup";

import {
  Form,
  FormField,
  FormPicker as Picker,
  SubmitButton,
} from "../components/forms";
import React, { useEffect, useState } from "react";
import { auth, database } from "../config/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";

import ActivityIndicator from "../components/ActivityIndicator";
import CategoryPickerItem from "../components/CategoryPickerItem";
import FormImagePicker from "../components/forms/FormImagePicker";
import ImageBackground from "react-native/Libraries/Image/ImageBackground";
import InfoWithAction from "../components/InfoWithAction";
import Screen from "../components/Screen";
import { StyleSheet } from "react-native";
import UploadFile from "../utility/uploadFile";
import UploadScreen from "./UploadScreen";
import { getAuth } from "firebase/auth";
import routes from "../navigation/routes";
import { v4 as uuidv4 } from "uuid";

const validationSchema = Yup.object().shape({
  title: Yup.string().required().min(1).label("Title"),
  price: Yup.number().required().min(1).max(10000000).label("Price"),
  description: Yup.string().label("Description"),
  category: Yup.object().required().nullable().label("Category"),
  images: Yup.array().min(1, "Please select at least one image."),
});

function ListingEditScreen({ navigation }) {
  const auth = getAuth();
  const user = auth.currentUser;
  const [imageURLs, setImageURLs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const categoriesQuery = query(collection(database, "Categories"));
    const unsubscribeCategories = onSnapshot(
      categoriesQuery,
      (querySnapshot) => {
        const categories = [];
        querySnapshot.forEach((doc) => {
          categories.push({
            id: doc.id,
            label: doc.data().label,
            icon: doc.data().icon,
            backgroundColor: doc.data().backgroundColor,
          });
        });
        setCategories(categories);
      }
    );

    // Unsubscribe from events when no longer in use
    return unsubscribeCategories;
  }, []);

  const handleSubmit = async (listing, { resetForm }) => {
    setLoading(true);

    const imageUrls = await Promise.all(
      listing.images.map(async (image) => await UploadFile(image))
    );

    console.log(imageUrls);

    // const id = uuidv4();
    // setDoc(doc(database, "Listings", id), {
    //   title: listing.title,
    //   price: parseInt(listing.price),
    //   description: listing.description,
    //   category: "/Categories/" + listing.category.id,
    //   images: imageURLs,
    //   author: user.uid,
    //   createdAt: new Date(),
    // }).then(() => {
    //   resetForm();
    //   navigation.navigate(routes.LISTING_DETAILS, {
    //     listingId: id,
    //     listingAuthor: user.uid,
    //   });
    //   setLoading(false);
    // });
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
        {user.isAnonymous ? (
          <InfoWithAction
            information='Please sign in to post and edit your listings and stores'
            buttonTitle='Sign In'
            onButtonPress={handleSignOut}
          />
        ) : (
          <Form
            initialValues={{
              title: "",
              price: 0,
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
