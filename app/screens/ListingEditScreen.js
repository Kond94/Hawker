import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";
import {
  Form,
  FormField,
  FormPicker as Picker,
  SubmitButton,
} from "../components/forms";
import CategoryPickerItem from "../components/CategoryPickerItem";
import Screen from "../components/Screen";
import FormImagePicker from "../components/forms/FormImagePicker";
import UploadScreen from "./UploadScreen";
import Firebase from "../config/firebase";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
const validationSchema = Yup.object().shape({
  title: Yup.string().required().min(1).label("Title"),
  price: Yup.number().required().min(1).max(10000).label("Price"),
  description: Yup.string().label("Description"),
  category: Yup.object().required().nullable().label("Category"),
  images: Yup.array().min(1, "Please select at least one image."),
});

function ListingEditScreen() {
  const [categories, setCategories] = useState([]);
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
    if (imageUrls.length === listing.images.length) {
      setUploadProgress(1);
      Firebase.firestore()
        .collection("Listings")
        .add({
          title: listing.title,
          price: listing.price,
          description: listing.description,
          category: listing.category.id,
          images: imageUrls,
          author: Firebase.auth().currentUser.uid,
        })
        .then(() => {
          resetForm();
          setTimeout(() => setIsUploading(false), 500);
        });
    }
  };

  return (
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
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});
export default ListingEditScreen;
