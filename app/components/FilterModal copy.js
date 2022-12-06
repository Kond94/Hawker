import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";

import AppButton from "./Button";
import AppText from "./Text";
import DatePicker from "react-native-date-picker";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import colors from "../config/colors";
import { currencyFormatter } from "../utility/numberFormat";
import moment from "moment";

const { width } = Dimensions.get("window");
const FilterModal = ({ toggleModal, activeSort, setActiveSort }) => {
  const [sliderScrollEnabled, setSliderScrollEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date("2022-01-01"));
  const [active, setActive] = useState(0);
  const [xTabOne, setXTabOne] = useState(0);
  const [xTabTwo, setXTabTwo] = useState(0);
  const [translateX, setTranslateX] = useState(new Animated.Value(0));
  const [translateY, setTranslateY] = useState(-1000);
  const [translateXTabOne, setTranslateXTabOne] = useState(
    new Animated.Value(0)
  );
  const [translateXTabTwo, setTranslateXTabTwo] = useState(
    new Animated.Value(width)
  );
  const [multiSliderValue, setMultiSliderValue] = React.useState([5000, 50000]);

  sliderOneValuesChangeFinish = () => setSliderOneChanging(false);

  multiSliderValuesChange = (values) => setMultiSliderValue(values);

  nonCollidingMultiSliderValuesChange = (values) =>
    setNonCollidingMultiSliderValue(values);
  const handleSlide = (type) => {
    Animated.spring(translateX, {
      toValue: type,
      duration: 100,
    }).start();
    if (active === 0) {
      Animated.parallel([
        Animated.spring(translateXTabOne, {
          toValue: 0,
          duration: 100,
        }).start(),
        Animated.spring(translateXTabTwo, {
          toValue: width,
          duration: 100,
        }).start(),
      ]);
    } else {
      Animated.parallel([
        Animated.spring(translateXTabOne, {
          toValue: -width,
          duration: 100,
        }).start(),
        Animated.spring(translateXTabTwo, {
          toValue: 0,
          duration: 100,
        }).start(),
      ]);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white, borderRadius: 10 }}>
      <AppText
        style={{
          textAlign: "center",
          fontWeight: "800",
          fontSize: 20,
          margin: 20,
        }}
      >
        Sort
      </AppText>
      <View
        style={{
          width: "90%",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            marginBottom: 20,
            height: 40,
            position: "relative",
          }}
        >
          <Animated.View
            style={{
              position: "absolute",
              width: "50%",
              height: "100%",
              top: 0,
              left: 0,
              backgroundColor: "#007aff",
              borderRadius: 4,
              transform: [
                {
                  translateX,
                },
              ],
            }}
          />
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#007aff",
              borderRadius: 4,
              borderRightWidth: 0,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            }}
            onLayout={(event) => setXTabOne(event.nativeEvent.layout.x)}
            onPress={() => {
              setActive(0), handleSlide(xTabOne);
            }}
          >
            <Text
              style={{
                color: active === 0 ? "#fff" : "#007aff",
              }}
            >
              Date
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#007aff",
              borderRadius: 4,
              borderLeftWidth: 0,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            }}
            onLayout={(event) => setXTabTwo(event.nativeEvent.layout.x)}
            onPress={() => {
              setActive(1), handleSlide(xTabTwo);
            }}
          >
            <Text
              style={{
                color: active === 1 ? "#fff" : "#007aff",
              }}
            >
              Price
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView scrollEnabled={sliderScrollEnabled}>
          <Animated.View
            style={{
              justifyContent: "center",
              alignItems: "center",
              transform: [
                {
                  translateX: translateXTabOne,
                },
              ],
            }}
            onLayout={(event) => setTranslateY(event.nativeEvent.layout.height)}
          >
            <View style={styles.tabRenderContainer}>
              <View style={styles.fieldContainer}>
                <AppText style={styles.labelText}>From: </AppText>
                <TouchableOpacity
                  onPress={() => setOpen(true)}
                  style={styles.feildValueContainer}
                >
                  <AppText style={styles.fieldValueText}>
                    {moment(date).format("LL")}
                  </AppText>
                </TouchableOpacity>
              </View>
              <View style={styles.fieldContainer}>
                <AppText style={styles.labelText}>Order: </AppText>
                <TouchableOpacity
                  onPress={() => {
                    setActiveSort({
                      ...activeSort,
                      order: activeSort.order === "asc" ? "desc" : "asc",
                    });
                  }}
                  style={{
                    borderWidth: 1,
                    padding: 3,
                    borderRadius: 10,
                    borderColor: colors.secondary,
                    backgroundColor: colors.secondary,
                  }}
                >
                  <AppText
                    style={{ fontSize: 18, color: "#fff", fontWeight: "bold" }}
                  >
                    {activeSort.order === "asc" ? "Old to New" : "New to Old"}
                  </AppText>
                </TouchableOpacity>
              </View>
              <DatePicker
                modal
                open={open}
                date={date}
                onConfirm={(date) => {
                  setDate(date);
                  setActiveSort({
                    ...activeSort,
                    field: "createdAt",
                    from: date,
                  });
                  setOpen(false);
                }}
                onCancel={() => {
                  setOpen(false);
                }}
                mode='date'
                maximumDate={new Date()}
                // androidVariant='iosClone'
              />
            </View>
            <View
              style={{
                alignSelf: "center",
                justifyContent: "flex-end",
                flex: 1,
              }}
            >
              <AppButton
                width='50%'
                title='Apply'
                onPress={() => {
                  toggleModal();
                }}
              />
            </View>
          </Animated.View>

          <Animated.View
            style={{
              justifyContent: "center",
              alignItems: "center",
              transform: [
                {
                  translateX: translateXTabTwo,
                },
                {
                  translateY: -translateY,
                },
              ],
            }}
          >
            <View style={styles.tabRenderContainer}>
              <View
                style={{
                  justifyContent: "center",
                }}
              >
                <Text style={styles.labelText}>
                  Minimum: {currencyFormatter(multiSliderValue[0])}
                </Text>
                <Text style={styles.labelText}>
                  Maximum: {currencyFormatter(multiSliderValue[1])}
                </Text>
              </View>
              <View
                style={{
                  width: "100%",
                  alignSelf: "center",
                  justifyContent: "center",
                }}
              >
                <MultiSlider
                  values={[multiSliderValue[0], multiSliderValue[1]]}
                  sliderLength={250}
                  onValuesChange={multiSliderValuesChange}
                  min={5000}
                  max={1000000}
                  step={10000}
                  allowOverlap={false}
                  customMarker={() => (
                    <View
                      style={{
                        width: 6,
                        height: 25,
                        backgroundColor: colors.secondary,
                      }}
                    ></View>
                  )}
                  // snapped
                  // customLabel={CustomLabel}
                />
              </View>
              <View style={styles.fieldContainer}>
                <AppText style={styles.labelText}>Order: </AppText>
                <TouchableOpacity
                  onPress={() => {
                    setActiveSort({
                      ...activeSort,
                      order: activeSort.order === "asc" ? "desc" : "asc",
                    });
                  }}
                  style={{
                    borderWidth: 1,
                    padding: 3,
                    borderRadius: 10,
                    borderColor: colors.secondary,
                    backgroundColor: colors.secondary,
                  }}
                >
                  <AppText
                    style={{ fontSize: 18, color: "#fff", fontWeight: "bold" }}
                  >
                    {activeSort.order === "asc"
                      ? "Low to Hight"
                      : "High to Low"}
                  </AppText>
                </TouchableOpacity>
              </View>
              <DatePicker
                modal
                open={open}
                date={date}
                onConfirm={(date) => {
                  setDate(date);
                  setActiveSort({
                    ...activeSort,
                    field: "createdAt",
                    from: date,
                  });
                  setOpen(false);
                }}
                onCancel={() => {
                  setOpen(false);
                }}
                mode='date'
                maximumDate={new Date()}
                // androidVariant='iosClone'
              />
            </View>
            <View
              style={{
                alignSelf: "center",
                justifyContent: "flex-end",
                flex: 1,
              }}
            >
              <AppButton
                width='50%'
                title='Apply'
                onPress={() => {
                  toggleModal();
                }}
              />
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {},
  container: {
    backgroundColor: "#fff",
    borderRadius: 10,
    flex: 0.7,
  },
  fieldContainer: {
    flexDirection: "row",
    margin: 15,
  },
  feildValueContainer: {
    borderWidth: 1,
    padding: 3,
    borderRadius: 10,
    borderColor: colors.secondary,
    backgroundColor: colors.secondary,
  },
  fieldValueText: { fontSize: 18, color: "#fff", fontWeight: "bold" },
  header: {
    margin: 10,
    fontSize: 20,
    fontWeight: "bold",
    color: colors.mediumRare,
    textAlign: "center",
  },
  labelText: {
    fontSize: 18,
    padding: 3,
    textAlignVertical: "bottom",
  },
  pillContainer: {
    flex: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    width: 100,
    height: "100%",
    borderColor: colors.primary,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  pillText: { fontSize: 16 },
  tabContainer: {
    marginVertical: 10,
    borderColor: colors.primary,
    borderWidth: 2,
    borderRadius: 10,
    // width: 300,
    height: 30,
    flexDirection: "row",
  },
  tabRenderContainer: {
    // alignItems: "center",
    // alignSelf: "center",
  },
});

export default FilterModal;
