import * as Yup from "yup";

import {
  Form,
  FormField,
  FormPicker as Picker,
  SubmitButton,
} from "../components/forms";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { auth, database } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";

import ActivityIndicator from "../components/ActivityIndicator";
import AppText from "../components/Text";
import Appstyles from "../config/Appstyles";
import { AuthenticatedUserContext } from "../auth/AuthenticatedUserProvider";
import { CategoriesContext } from "../context/CategoriesProvider";
import CategoryPickerItem from "../components/CategoryPickerItem";
import FormImagePicker from "../components/forms/FormImagePicker";
import ImageBackground from "react-native/Libraries/Image/ImageBackground";
import InfoWithAction from "../components/InfoWithAction";
import Screen from "../components/Screen";
import routes from "../navigation/routes";
import { useContext } from "react";
import { v4 as uuidv4 } from "uuid";

const validationSchema = Yup.object().shape({
  title: Yup.string().required().min(1).label("Title"),
  price: Yup.number().required().min(1).max(10000000).label("Price"),
  description: Yup.string().label("Description"),
  category: Yup.object().required().nullable().label("Category"),
  images: Yup.array().min(1, "Please select at least one image."),
});

function ListingEditScreen({ navigation }) {
  const { user } = useContext(AuthenticatedUserContext);
  const { categories } = useContext(CategoriesContext);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (listing, { resetForm }) => {
    setLoading(true);

    const id = uuidv4();
    setDoc(doc(database, "Listings", id), {
      title: listing.title,
      price: parseInt(listing.price),
      description: listing.description,
      category: listing.category.id,
      images: listing.images,
      author: user.uid,
      createdAt: new Date(),
    }).then(() => {
      resetForm();
      navigation.navigate(routes.LISTING_DETAILS, {
        listingId: id,
        listingAuthor: user.uid,
      });
      setLoading(false);
    });
  };
  const handleSignOut = async () => {
    auth()
      .signOut()
      .then(() => console.log("User signed out!"));
  };
  return (
    <>
      {loading && <ActivityIndicator visible={loading} />}
      <Screen>
        <View style={Appstyles.screenHeaderContainer}>
          <AppText style={Appstyles.screenHeaderText}>Add Listing</AppText>

          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity onPress={() => {}}>
              {/* <Icon
                name='sort'
                backgroundColor='#0000'
                iconColor='#000'
                circle={false}
              /> */}
            </TouchableOpacity>
          </View>
        </View>
        {user.isAnonymous ? (
          <InfoWithAction
            information='Please sign in to post and edit your listings and stores'
            buttonTitle='Sign In'
            onButtonPress={handleSignOut}
          />
        ) : (
          <View style={styles.form}>
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
          </View>
        )}
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  form: {
    paddingHorizontal: 10,
  },
});
export default ListingEditScreen;
