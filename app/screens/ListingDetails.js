import {
  Animated,
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import AppButton from "../components/Button";
import AppText from "../components/Text";
import Icon from "../components/Icon";
import React from "react";
import colors from "../config/colors";

const OFFSET = 40;
const ITEM_WIDTH = Dimensions.get("window").width - OFFSET * 2;
const ITEM_HEIGHT = 260;

const cards = [
  {
    id: 1,
    title: "Movie 1",
    posterUrl: require("../assets/samples/tenet.jpeg"),
  },
  { title: "Movie 2", posterUrl: require("../assets/samples/1917.jpeg") },
  {
    id: 2,
    title: "Movie 3",
    posterUrl: require("../assets/samples/spiderman.jpeg"),
  },
  {
    id: 3,
    title: "Movie 4",
    posterUrl: require("../assets/samples/mando.jpeg"),
  },
];

export default function ListingDetails() {
  const scrollX = React.useRef(new Animated.Value(0)).current;

  return (
    <View>
      <View style={styles.header}>
        <Icon
          name='arrow-left'
          backgroundColor='#0000'
          iconColor='#000'
          circle={false}
        />
        <AppText style={styles.headerTitle}>Listing Details</AppText>
        {/* <Icon
            name='filter-remove'
            backgroundColor='#0000'
            iconColor={colors.mediumRare}
            circle={false}
          /> */}
      </View>
      <View style={{ marginHorizontal: 13 }}>
        <AppText
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "#5d5d5d",
          }}
        >
          Title
        </AppText>
        <AppText numberOfLines={2} style={{ color: "#5d5d5d" }}>
          Subtitle, blah blah blah...
        </AppText>
      </View>
      <View>
        <ScrollView
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
          {cards.map((item, idx) => {
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
                key={item.id}
                style={{
                  width: ITEM_WIDTH,
                  height: ITEM_HEIGHT,
                  marginLeft: idx === 0 ? OFFSET : undefined,
                  marginRight: idx === cards.length - 1 ? OFFSET : undefined,
                  opacity: opacity,
                  transform: [{ scale: translate }],
                }}
              >
                <ImageBackground
                  source={item.posterUrl}
                  style={{
                    flex: 1,
                    resizeMode: "cover",
                    justifyContent: "center",
                  }}
                  imageStyle={{ borderRadius: 6 }}
                />
              </Animated.View>
            );
          })}
        </ScrollView>
      </View>
      <View style={{ marginHorizontal: 13, marginTop: 20 }}>
        <AppText
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: colors.primary,
          }}
        >
          Mwk 2,000
        </AppText>
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
            marginTop: 10,
            color: colors.mediumRare,
          }}
        >
          Blah Blah blah scentnce. Blah Blah blah scentnce. Blah Blah blah
          scentnce. Blah Blah blah scentnce. Blah Blah blah scentnce. Blah Blah
          blah scentnce.
        </AppText>
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            paddingTop: 30,
          }}
        >
          <AppButton square title='Contact Seller' width='45%' outline />
          <AppButton square title='Buy Now' width='45%' color='primary' />
        </View>
      </View>
    </View>
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
});
