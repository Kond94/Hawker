import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";

import AppButton from "../components/Button";
import AppText from "../components/Text";
import { AuthenticatedUserContext } from "../auth/AuthenticatedUserProvider";
import ContactSellerForm from "../components/ContactSellerForm";
import FastImage from "react-native-fast-image";
import Icon from "../components/Icon";
import ImageView from "react-native-image-viewing";
import { LikedListingsContext } from "../context/LikedListingsProvider";
import Modal from "react-native-modal";
import Screen from "../components/Screen";
import colors from "../config/colors";
import { currencyFormatter } from "../utility/numberFormat";
import { database } from "../config/firebase";
import moment from "moment";
import routes from "../navigation/routes";
import { useContext } from "react";

const OFFSET = 40;
const ITEM_WIDTH = Dimensions.get("window").width - OFFSET * 2;
const ITEM_HEIGHT = 260;

export default function ListingDetails({ route, navigation }) {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [author, setAuthor] = useState();
  const [listing, setListing] = useState();
  const { likedListings } = useContext(LikedListingsContext);

  const [authorListings, setAuthorListings] = useState([]);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const liked = likedListings
    .map((l) => l.listingId)
    .includes(route.params.listingId)
    ? true
    : false;
  useEffect(() => {
    const unSubscribeListings = onSnapshot(
      doc(database, "Listings", route.params.listingId),
      (doc) => {
        setListing(doc.data());
      }
    );

    const authorSubscriber = onSnapshot(
      doc(database, "Users", route.params.listingAuthor),
      (doc) => {
        setAuthor({ id: doc.id, ...doc.data() });
      }
    );

    const authorListingsQuery = query(
      collection(database, "Listings"),
      where("author", "==", route.params.listingAuthor)
    );

    const authorListingsSubscriber = onSnapshot(
      authorListingsQuery,
      (querySnapshot) => {
        const authorListings = [];
        querySnapshot.forEach((doc) => {
          authorListings.push({ id: doc.id, ...doc.data() });
        });
        setAuthorListings(authorListings);
      }
    );
    // Unsubscribe from events when no longer in use

    return authorSubscriber, authorListingsSubscriber, unSubscribeListings;
  }, [navigation, likedListings]);

  const likeListing = async () => {
    if (liked) {
      await deleteDoc(
        doc(database, "LikedListings", user.uid + "_" + route.params.listingId)
      ).then(() => {
        setDoc(
          doc(database, "Listings", route.params.listingId),
          {
            likedCount: listing.likedCount - 1,
          },
          { merge: true }
        );
      });
    } else {
      await setDoc(
        doc(database, "LikedListings", user.uid + "_" + route.params.listingId),
        {
          uid: user.uid,
          listingId: route.params.listingId,
        },
        { merge: true }
      ).then(() => {
        setDoc(
          doc(database, "Listings", route.params.listingId),
          {
            likedCount: listing.likedCount + 1,
          },
          { merge: true }
        );
      });
    }
  };

  const scrollX = React.useRef(new Animated.Value(0)).current;
  return (
    <Screen>
      <Modal
        testID={"modal"}
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        onSwipeComplete={() => setModalVisible(false)}
        swipeDirection={["down"]}
        style={styles.contactModal}
        animationInTiming={800}
        animationOutTiming={800}
        backdropTransitionInTiming={800}
        backdropTransitionOutTiming={800}
        backdropColor='#B4B3DB'
        backdropOpacity={0.8}
      >
        <ContactSellerForm
          buyer={user.uid}
          seller={listing?.author}
          toggleModal={setModalVisible}
        />
      </Modal>
      <ImageView
        images={listing?.images.map((image) => {
          return { uri: image };
        })}
        // animationType='slide'
        imageIndex={imageIndex}
        visible={imageViewerVisible}
        onRequestClose={() => setImageViewerVisible(false)}
      />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name='arrow-left'
            backgroundColor='#0000'
            iconColor='#000'
            circle={false}
          />
        </TouchableOpacity>
        <AppText style={styles.headerTitle}>Listing Details</AppText>
        <View style={{ width: 40 }} />
      </View>
      <View style={{ marginHorizontal: 13 }}>
        <AppText
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "#5d5d5d",
          }}
        >
          {listing?.title}
        </AppText>
        <View style={{ flexDirection: "row" }}>
          <AppText
            numberOfLines={2}
            style={{ color: "#5d5d5d", marginRight: 5 }}
          >
            Listed by: {author?.displayName}
          </AppText>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(routes.LISTINGS, {
                author: author,
                authorListings: authorListings,
              })
            }
          >
            <AppText style={{ color: colors.secondary, fontWeight: "bold" }}>
              {authorListings.length > 2
                ? "View " +
                  (authorListings.length - 1).toString() +
                  " Other Listings"
                : ""}
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView key='scroll1'>
        <View style={{ flex: 1 }}>
          <ScrollView
            key='scroll2'
            horizontal={true}
            decelerationRate={"normal"}
            snapToInterval={ITEM_WIDTH}
            style={{ marginTop: 20, paddingHorizontal: 0 }}
            showsHorizontalScrollIndicator={false}
            bounces={true}
            disableIntervalMomentum
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={12}
          >
            {listing?.images.map((item, idx) => {
              const inputRange = [
                (idx - 1) * ITEM_WIDTH,
                idx * ITEM_WIDTH,
                (idx + 1) * ITEM_WIDTH,
              ];

              const translate = scrollX.interpolate({
                inputRange,
                outputRange: [0.85, 1, 0.85],
              });

              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.5, 1, 0.5],
              });

              return (
                <Animated.View
                  key={item}
                  style={{
                    width: ITEM_WIDTH,
                    height: ITEM_HEIGHT,
                    marginLeft: idx === 0 ? OFFSET : undefined,
                    marginRight:
                      idx === item.images?.length - 1 ? OFFSET : undefined,
                    opacity: opacity,
                    transform: [{ scale: translate }],
                  }}
                >
                  <TouchableNativeFeedback
                    onPress={() => {
                      setImageViewerVisible(true);
                    }}
                  >
                    <FastImage
                      source={{ uri: item }}
                      style={{
                        flex: 1,
                        resizeMode: "cover",
                        justifyContent: "center",
                      }}
                      imageStyle={{ borderRadius: 6 }}
                    />
                  </TouchableNativeFeedback>
                </Animated.View>
              );
            })}
          </ScrollView>
        </View>
        <View style={{ marginHorizontal: 13, marginTop: 20 }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <AppText
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: colors.primary,
              }}
            >
              {currencyFormatter(listing?.price)}
            </AppText>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity onPress={() => likeListing()}>
                <Icon
                  name={liked ? "heart" : "heart-outline"}
                  backgroundColor='#0000'
                  iconColor={liked ? colors.primary : colors.mediumRare}
                  circle={false}
                />
              </TouchableOpacity>
              <AppText>{listing?.likedCount}</AppText>
            </View>
          </View>
          <AppText
            style={{
              fontSize: 18,
              marginTop: 20,
              color: colors.mediumRare,
            }}
          >
            Description
          </AppText>
          <AppText
            style={{
              fontStyle: "italic",
              color: colors.mediumRare,
            }}
          >
            Listed {moment(listing?.createdAt.toDate()).fromNow()}
          </AppText>
          <AppText
            numberOfLines={3}
            style={{
              marginTop: 10,
              color: colors.mediumRare,
            }}
          >
            {listing?.description}
          </AppText>
          <View
            style={{
              justifyContent: "center",
              flexDirection: "row",
              paddingBottom: 30,
            }}
          >
            {user.uid === author?.id ? (
              <AppButton
                onPress={() => {}}
                square
                title='Edit Listing'
                width='45%'
                outline
              />
            ) : (
              <AppButton
                onPress={() => setModalVisible(true)}
                square
                title='Contact Seller'
                width='45%'
                outline
              />
            )}

            {/* <AppButton square title='Buy Now' width='45%' color='primary' /> */}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );

  // return <Listings />;
}

const styles = StyleSheet.create({
  categoriesCard: {},
  categoriesContainer: {
    paddingHorizontal: 10,
  },
  categoriesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    marginVertical: 10,
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: colors.mediumRare,
    alignSelf: "center",
    textAlign: "center",
    flex: 1,
  },
  searchBox: {
    alignItems: "center",
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
    margin: 5,
  },
  contactModal: {
    justifyContent: "flex-end",
    margin: 0,
  },
});
