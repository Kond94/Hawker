import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";

import AppTextInput from "../components/TextInput";
import ContactSellerForm from "../components/ContactSellerForm";
import FastImage from "react-native-fast-image";
import ImageBackground from "react-native/Libraries/Image/ImageBackground";
import ImageView from "react-native-image-viewing";
import { SliderBox } from "react-native-image-slider-box";
import Text from "../components/Text";
import colors from "../config/colors";
import firestore from "@react-native-firebase/firestore";

function ListingDetailsScreen({ route }) {
  const [visible, setIsVisible] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [author, setAuthor] = useState();
  const listing = route.params;

  useEffect(() => {
    const subscriber = firestore()
      .collection("Users")
      .doc(listing.author)
      .onSnapshot((documentSnapshot) => {
        setAuthor(documentSnapshot.data());
      });
    // Stop listening for updates when no longer required
    subscriber;
  }, []);

  return (
    <>
      <ImageBackground
        blurRadius={0.5}
        style={{ flex: 1 }}
        source={require("../assets/app-background.png")}
      >
        <View style={styles.userContainer}>
          {/* <ListItem
            image={{
              uri: author.photoURL
                ? author.photoURL
                : "../assets/avatar-placeholder.png",
            }}
            title={author.name}
            subTitle='5 other Listings'
          /> */}
        </View>
        <ImageView
          images={listing.images.map((image) => {
            return { uri: image };
          })}
          imageIndex={imageIndex}
          visible={visible}
          onRequestClose={() => setIsVisible(false)}
        />
        <KeyboardAvoidingView
          behavior='position'
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 100}
        >
          <ScrollView>
            <SliderBox
              circleLoop
              resizeMethod={"resize"}
              resizeMode='contain'
              autoplay
              imageLoadingColor={colors.primary}
              dotColor={colors.primary}
              ImageComponent={FastImage}
              images={listing.images.map((imageUrl) => imageUrl)}
              onCurrentImagePressed={(index) => {
                setIsVisible(true);
                setImageIndex(index);
              }}
            />

            <View style={styles.detailsContainer}>
              <Text style={styles.title}>{listing.title}</Text>
              <Text style={styles.price}>${listing.price}</Text>

              <ContactSellerForm listing={listing} />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  detailsContainer: {
    padding: 20,
  },
  image: {
    width: "100%",
    height: 250,
  },
  price: {
    color: colors.secondary,
    fontWeight: "bold",
    fontSize: 20,
    marginVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
  },
  userContainer: {
    marginVertical: 10,
  },
});

export default ListingDetailsScreen;
