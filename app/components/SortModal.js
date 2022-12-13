import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AppButton from "./Button";
import AppText from "./Text";
import DatePicker from "react-native-date-picker";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import React from "react";
import appConfig from "../config/appConfig";
import colors from "../config/colors";
import { currencyFormatter } from "../utility/numberFormat";
import moment from "moment";
import { useEffect } from "react";
import { useState } from "react";

const { width } = Dimensions.get("window");

function SortModal({ toggleModal, sort, setSort }) {
  const [fromDate, setFromDate] = useState(appConfig.launchDate);
  const [toDate, setToDate] = useState(appConfig.today);
  const [isToDatePickerOpen, setIsToDatePickerOpen] = useState(false);
  const [isFromDatePickerOpen, setIsFromDatePickerOpen] = useState(false);
  const [multiSliderValue, setMultiSliderValue] = useState([
    sort.min,
    sort.max,
  ]);
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

  useEffect(() => {
    const unsubscribe = handleSlide(active === 0 ? xTabOne : xTabTwo);
    // ToastAndroid.show(animation+ ' Animation', ToastAndroid.SHORT);
    return () => unsubscribe;
  }, [active]);

  handleSlide = (type) => {
    Animated.spring(translateX, {
      toValue: type,
      duration: 100,
      useNativeDriver: true,
    }).start();
    if (active === 0) {
      Animated.parallel([
        Animated.spring(translateXTabOne, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }).start(),
        Animated.spring(translateXTabTwo, {
          toValue: width,
          duration: 100,
          useNativeDriver: true,
        }).start(),
      ]);
    } else {
      Animated.parallel([
        Animated.spring(translateXTabOne, {
          toValue: -width,
          duration: 100,
          useNativeDriver: true,
        }).start(),
        Animated.spring(translateXTabTwo, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }).start(),
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <AppText style={styles.header}>Sort & Filter By:</AppText>
      <View style={styles.tabContainer}>
        <Animated.View
          style={{
            ...styles.tabButtonContainer,
            transform: [
              {
                translateX,
              },
            ],
          }}
        />
        <TouchableOpacity
          style={styles.tabButtonLeft}
          onLayout={(event) => setXTabOne(event.nativeEvent.layout.x)}
          onPress={() => {
            setActive(0);
            setSort({
              ...sort,
              field: "createdAt",
              min: new Date(2022, 0, 1),
              max: new Date(),
            });
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
          style={styles.tabButtonRight}
          onLayout={(event) => setXTabTwo(event.nativeEvent.layout.x)}
          onPress={() => {
            setActive(1);
            setSort({
              ...sort,
              field: "price",
              min: 0,
              max: 500000,
            });
            setMultiSliderValue([0, 500000]);
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

      <Animated.View
        style={{
          transform: [
            {
              translateX: translateXTabOne,
            },
          ],
        }}
        onLayout={(event) => setTranslateY(event.nativeEvent.layout.height)}
      >
        <View style={styles.fieldContainer}>
          <AppText style={styles.labelText}>From: </AppText>
          <TouchableOpacity
            onPress={() => setIsFromDatePickerOpen(true)}
            style={styles.fieldValueContainer}
          >
            <AppText style={styles.fieldValueText}>
              {moment(fromDate).format("LL")}
            </AppText>
          </TouchableOpacity>
        </View>
        <DatePicker
          modal
          open={isFromDatePickerOpen}
          date={fromDate}
          onConfirm={(date) => {
            setFromDate(date);
            setSort({ ...sort, min: date });
            setIsFromDatePickerOpen(false);
          }}
          onCancel={() => {
            setIsFromDatePickerOpen(false);
          }}
          mode='date'
          maximumDate={appConfig.today}

          // androidVariant='iosClone'
        />
        <View style={styles.fieldContainer}>
          <AppText style={styles.labelText}>To: {"     "}</AppText>
          <TouchableOpacity
            onPress={() => setIsToDatePickerOpen(true)}
            style={styles.fieldValueContainer}
          >
            <AppText style={styles.fieldValueText}>
              {moment(toDate).format("LL")}
            </AppText>
          </TouchableOpacity>
        </View>
        <DatePicker
          modal
          open={isToDatePickerOpen}
          date={fromDate}
          onConfirm={(date) => {
            setToDate(date);
            setSort({
              ...sort,
              max: date,
            });
            setIsToDatePickerOpen(false);
          }}
          onCancel={() => {
            setIsToDatePickerOpen(false);
          }}
          mode='date'
          maximumDate={appConfig.today}
          // androidVariant='iosClone'
        />
        <View style={styles.fieldContainer}>
          <AppText style={styles.labelText}>Order: </AppText>
          <TouchableOpacity
            onPress={() => {
              setSort({
                ...sort,
                order: sort.order === "asc" ? "desc" : "asc",
              });
            }}
            style={styles.fieldValueContainer}
          >
            <AppText style={styles.fieldValueText}>
              {sort.order === "asc" ? "Old to New" : "New to Old"}
            </AppText>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.View
        style={{
          height: 60,
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
        <View style={styles.fieldContainer}>
          <Text style={styles.labelText}>Minimum:</Text>
          <View style={styles.fieldValueContainer}>
            <AppText style={styles.fieldValueText}>
              {currencyFormatter(multiSliderValue[0])}
            </AppText>
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.labelText}>Maximum:</Text>
          <View style={styles.fieldValueContainer}>
            <AppText style={styles.fieldValueText}>
              {multiSliderValue[1] <= 499999
                ? currencyFormatter(multiSliderValue[1])
                : "Unlimited"}
            </AppText>
          </View>
        </View>
        <View
          style={{
            alignSelf: "center",
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          <MultiSlider
            values={multiSliderValue}
            sliderLength={250}
            onValuesChange={setMultiSliderValue}
            min={0}
            max={500000}
            step={10000}
            allowOverlap={false}
            customMarker={() => <View style={styles.customMarker}></View>}
            // snapped
            // customLabel={CustomLabel}
          />
        </View>

        <View style={styles.fieldContainer}>
          <AppText style={styles.labelText}>Order: </AppText>
          <TouchableOpacity
            onPress={() => {
              setSort({
                ...sort,
                field: "price",
                order: sort.order === "asc" ? "desc" : "asc",
              });
            }}
            style={styles.fieldValueContainer}
          >
            <AppText style={styles.fieldValueText}>
              {sort.order === "asc" ? "Low to High" : "High to Low"}
            </AppText>
          </TouchableOpacity>
        </View>
      </Animated.View>
      <View
        style={{ alignItems: "center", justifyContent: "flex-start", top: 0 }}
      >
        <AppButton
          onPress={() => {
            sort.field === "price"
              ? setSort({
                  ...sort,
                  min: multiSliderValue[0],
                  max:
                    multiSliderValue[1] >= 499999
                      ? 10000000
                      : multiSliderValue[1],
                })
              : {};
            toggleModal();
          }}
          title={"Apply"}
          width='50%'
          square
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: "85%",
    marginLeft: "auto",
    marginRight: "auto",
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
  },
  customMarker: {
    width: 6,
    height: 25,
    backgroundColor: colors.secondary,
    borderRadius: 10,
  },
  fieldContainer: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 7,
  },
  fieldValueContainer: {
    borderWidth: 1,
    padding: 2,
    borderRadius: 10,
    borderColor: colors.secondary,
    backgroundColor: colors.secondary,
  },
  fieldValueText: { fontSize: 16, color: "#fff", fontWeight: "bold" },
  header: {
    textAlign: "center",
    fontWeight: "800",
    fontSize: 20,
    marginTop: 20,
  },
  labelText: {
    fontSize: 16,
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
  sectionContainer: {
    marginVertical: 10,
    borderWidth: 3,
    borderRadius: 10,
    borderColor: colors.gray,
  },
  sectionHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  sectionHeader: {
    textAlign: "left",
    fontWeight: "700",
    fontSize: 18,
    margin: 5,
  },
  tabButtonLeft: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#007aff",
    borderRadius: 4,
    borderRightWidth: 0,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  tabButtonRight: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#007aff",
    borderRadius: 4,
    borderLeftWidth: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  tabButtonContainer: {
    position: "absolute",
    width: "50%",
    height: "100%",
    top: 0,
    left: 0,
    backgroundColor: "#007aff",
    borderRadius: 4,
  },
  tabContainer: {
    flexDirection: "row",
    marginTop: 40,
    marginBottom: 20,
    height: 36,
    position: "relative",
  },
});

export default SortModal;
