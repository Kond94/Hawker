import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";

import ContactSellerForm from "../components/ContactSellerForm";
import FastImage from "react-native-fast-image";
import Firebase from "../config/firebase";
import ImageBackground from "react-native/Libraries/Image/ImageBackground";
import ImageView from "react-native-image-viewing";
import ListItem from "../components/lists/ListItem";
import { SliderBox } from "react-native-image-slider-box";
import Text from "../components/Text";
import colors from "../config/colors";

function ListingDetailsScreen({ route }) {
  const [visible, setIsVisible] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [user, setUser] = useState(0);
  const listing = route.params;

  useEffect(() => {
    const subscriber = Firebase.firestore()
      .collection("Users")
      .doc(listing.author)
      .onSnapshot((documentSnapshot) => {
        setUser(documentSnapshot.data());
      });
    console.log(user);
    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);

  return (
    <>
      <ImageBackground
        blurRadius={0.5}
        style={{ flex: 1 }}
        source={require("../assets/app-background.png")}
      >
        <View style={styles.userContainer}>
          <ListItem
            image={{ uri: user.photoURL }}
            title={user.name}
            subTitle='5 other Listings'
          />
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
