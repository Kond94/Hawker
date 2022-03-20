import React from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import colors from "../config/colors";
import ContactSellerForm from "../components/ContactSellerForm";
import ListItem from "../components/lists/ListItem";
import Text from "../components/Text";
import FastImage from "react-native-fast-image";
import { SliderBox } from "react-native-image-slider-box";
import ImageView from "react-native-image-viewing";
import { useState } from "react/cjs/react.development";

function ListingDetailsScreen({ route }) {
  const listing = route.params;
  const [visible, setIsVisible] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  return (
    <>
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
            resizeMethod={"resize"}
            resizeMode='contain'
            autoplay
            imageLoadingColor={colors.primary}
            dotColor={colors.primary}
            ImageComponent={FastImage}
            images={listing.images}
            onCurrentImagePressed={(index) => {
              setIsVisible(true);
              setImageIndex(index);
            }}
          />

          <View style={styles.detailsContainer}>
            <Text style={styles.title}>{listing.title}</Text>
            <Text style={styles.price}>${listing.price}</Text>
            <View style={styles.userContainer}>
              <ListItem
                image={require("../assets/mosh.jpg")}
                title='Mosh Hamedani'
                subTitle='5 Listings'
              />
            </View>
            <ContactSellerForm listing={listing} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    marginVertical: 40,
  },
});

export default ListingDetailsScreen;
