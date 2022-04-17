import * as Yup from "yup";

import {
  Form,
  FormField,
  FormPicker as Picker,
  SubmitButton,
} from "../components/forms";
import React, { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import ActivityIndicator from "../components/ActivityIndicator";
import CategoryPickerItem from "../components/CategoryPickerItem";
import Firebase from "../config/firebase";
import FormImagePicker from "../components/forms/FormImagePicker";
import ImageBackground from "react-native/Libraries/Image/ImageBackground";
import Screen from "../components/Screen";
import { StyleSheet } from "react-native";
import UploadScreen from "./UploadScreen";
import { v4 as uuidv4 } from "uuid";

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
  const [uploadProgress, setUploadProgress] = useState();
  useEffect(() => {
    const subscriber = Firebase.firestore()
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

  async function uploadImageAsync(uri) {
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

    const fileRef = ref(getStorage(), uuidv4());

    const uploadTask = await uploadBytesResumable(fileRef, blob);
    return await getDownloadURL(fileRef);
  }

  const handleSubmit = async (listing, { resetForm }) => {
    let imageUrls = [];
    setIsUploading(true);
    setUploadProgress(0);
    for (const file of listing.images) {
      const remoteURL = await uploadImageAsync(file);
      imageUrls.push(remoteURL);
    }
    setTimeout(() => setIsUploading(false), 500);

    if (imageUrls.length === listing.images.length) {
      setLoading(true);
      setUploadProgress(1);
      await Firebase.firestore().collection("Listings").add({
        title: listing.title,
        price: listing.price,
        description: listing.description,
        category: listing.category.id,
        images: imageUrls,
        author: Firebase.auth().currentUser.uid,
      });

      resetForm();
      setLoading(false);
    }
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
          onDone={() => console.log("Upload Done")}
          visible={isUploading}
        />
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
