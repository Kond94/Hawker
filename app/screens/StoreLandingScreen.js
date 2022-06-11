import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";

import AppText from "../components/Text";
import Carousel from "react-native-banner-carousel";
import ImageBackground from "react-native/Libraries/Image/ImageBackground";
import Text from "../components/Text";
import { getStore } from "../utility/fireStore";

function StoreLandingScreen({ route, navigation }) {
  const [store, setStore] = useState(null);
  useEffect(() => {
    const storeSubscriber = getStore(route.params.storeId, setStore);

    // Unsubscribe from events when no longer in use

    return storeSubscriber;
  }, []);

  // top banner start
  const BannerWidth = Dimensions.get("window").width;
  const BannerHeight = 160;

  const images = [
    "https://rukminim1.flixcart.com/flap/1688/280/image/5a55bfde3a5acd85.jpg?q=50",
    "https://rukminim1.flixcart.com/flap/3376/560/image/813ce1ebdfb5d14d.jpg?q=50",
    "https://rukminim1.flixcart.com/flap/1688/280/image/b16c5ac856ebb5d9.jpg?q=50",
  ];

  // top banner end

  const data_product = [
    {
      id: "a",
      value: "Sport Shoes",
      offer: "Up to 50% off",
      pic: "https://rukminim1.flixcart.com/image/120/120/k0463rk0/shoe/g/e/j/787-10-tying-blue-original-imafdk8v9zunhj5u.jpeg?q=80",
    },
    {
      id: "b",
      value: "Wrist Watchs",
      offer: "Up to 20% off",
      pic: "https://rukminim1.flixcart.com/image/120/120/jsc3ssw0/watch/z/f/y/1170-bl-br-fogg-original-imafdv97yfsrn9wt.jpeg?q=80",
    },
    {
      id: "c",
      value: "Womens Sarees",
      offer: "Up to 60% off",
      pic: "https://rukminim1.flixcart.com/image/120/120/k12go7k0/sari/p/h/c/free-bd030-bollydoll-designer-original-imafgjen5kwbudbm.jpeg?q=80",
    },
    {
      id: "d",
      value: "Headphons",
      offer: "Up to 30% off",
      pic: "https://rukminim1.flixcart.com/image/120/120/kj0bp8w0-0/headphone/l/j/0/bassheads-103-black-boat-original-imafyz3wqtqfzzwd.jpeg?q=80",
    },
    {
      id: "e",
      value: "Explore Now",
      offer: "Up to 80% off",
      pic: "https://rukminim1.flixcart.com/image/240/240/jrf8o7k0/hand-messenger-bag/a/h/3/fashion-shoulder-bag-pg-10-shoulder-bag-urban-trend-original-imaexs9wmanzw6hh.jpeg?q=60",
    },
    {
      id: "f",
      value: "Big Saving",
      offer: "Up to 90% off",
      pic: "https://rukminim1.flixcart.com/image/120/120/khxqt8w0-0/pendrive/type-a-to-type-c/c/g/g/sdddc2-064g-i35-sandisk-original-imafxubtqtxahat2.jpeg?q=80",
    },
    {
      id: "g",
      value: "Baby Care",
      offer: "Up to 30% off",
      pic: "https://rukminim1.flixcart.com/image/240/242/jgy0fbk0/bath-towel/p/6/3/ultra-soft-hooded-classic-and-designer-baby-bath-towel-bath-original-imaeqx28bykqqscx.jpeg?q=60",
    },
    {
      id: "h",
      value: "Routers",
      offer: "Up to 80% off",
      pic: "https://rukminim1.flixcart.com/image/240/240/jhjg13k0/router/g/n/n/tp-link-archer-c20-ac-wireless-dual-band-original-imaf5j9whw9bbetb.jpeg?q=60",
    },
    {
      id: "i",
      value: "Computers",
      offer: "Up to 90% off",
      pic: "https://rukminim1.flixcart.com/image/120/120/jn4x47k0/microphone-accessory/d/p/p/mobspy-3-5mm-clip-microphone-for-youtube-collar-mic-for-voice-original-imaf9vucqafs6gdm.jpeg?q=80",
    },
  ];
  const data_product_grid = 3;

  return (
    <>
      <ImageBackground
        blurRadius={0.5}
        style={{ flex: 1 }}
        source={require("../assets/app-background.png")}
      >
        <AppText style={{ fontSize: 30, fontWeight: "bold", margin: 10 }}>
          {store?.storeName}
        </AppText>
        <Carousel
          autoplay
          autoplayTimeout={5000}
          loop
          index={0}
          pageSize={BannerWidth}
        >
          {images.map((image, index) => (
            <View key={index}>
              <Image
                style={{ width: BannerWidth, height: BannerHeight }}
                source={{ uri: image }}
              />
            </View>
          ))}
        </Carousel>
        <FlatList
          data={data_product}
          renderItem={({ item }) => (
            <View style={styles.box_product}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("Productslist", {
                    paramKey: "Hit Sale",
                  })
                }
                style={styles.box_product_inner}
              >
                <View>
                  <Image
                    source={{ uri: item.pic }}
                    style={styles.box_product_img}
                  />
                </View>

                <View style={styles.box_product_inner_cont}>
                  <Text style={styles.box_product_inner_title}>
                    {item.value}{" "}
                  </Text>
                  <Text style={styles.box_product_inner_title_new}>
                    {item.offer}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.id}
          numColumns={data_product_grid}
        />
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  top_category_bar: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#fff",
  },

  top_category_inner_block: {
    margin: 5,
    marginTop: 0,
  },
  box_product: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: 105,
    borderColor: "#f0f0f0",
    borderWidth: 1,
    margin: 4,
  },
  top_category_image: {
    resizeMode: "contain",
    width: 50,
    height: 50,
    margin: 2,
    marginTop: 10,
  },

  top_category_text_block: {
    flexDirection: "row",
    justifyContent: "space-between",
    justifyContent: "center",
  },

  top_category_text: {
    color: "#494949",
    fontWeight: "200",
    fontSize: 11,
  },
  box_product_inner: {
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
  },

  box_product_img: {
    height: 80,
    width: 95,
    resizeMode: "contain",
    margin: 8,
    marginBottom: 0,
  },

  box_product_inner_cont: { padding: 10, width: "100%" },

  box_product_inner_title: { fontSize: 11 },

  box_product_inner_title_new: { color: "green", paddingTop: 0, fontSize: 12 },

  box_horizontal_box: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#f0f0f0",
    borderWidth: 1,
    margin: 0,
    marginBottom: 2,
    marginTop: 2,
  },

  box_horizontal_inner: {
    backgroundColor: "#f0f0f0",
    width: "100%",
    borderRadius: 0,
    overflow: "hidden",
  },

  box_horizontal_img: {
    height: 230,
    width: 150,
    resizeMode: "contain",
    margin: 0,
    marginBottom: 0,
  },

  box_singal: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#f0f0f0",
    borderWidth: 1,
    margin: 0,
  },

  box_singal_inner: {
    backgroundColor: "#ccc",
    width: "100%",
    borderRadius: 0,
    overflow: "hidden",
  },

  box_singal_img: {
    height: 160,
    width: "100%",
    resizeMode: "contain",
    margin: 0,
    marginBottom: 0,
  },

  box_product_list: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    alignItems: "flex-start",
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: "#e8e8ed",
    justifyContent: "flex-start",
  },

  box_product_list_inner: {
    backgroundColor: "#fff",
    borderWidth: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: "#ccc",
    padding: 15,
    borderStyle: "dotted",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 0,
  },

  box_product_list_img: {
    height: 80,
    width: 950,
    resizeMode: "contain",
    margin: 8,
    marginBottom: 0,
  },

  box_product_list_inner_cont: {
    padding: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  box_product_list_inner_title: { fontSize: 11 },

  box_product_list_inner_title_new: {
    color: "green",
    paddingTop: 0,
    fontSize: 12,
  },
});

export default StoreLandingScreen;
