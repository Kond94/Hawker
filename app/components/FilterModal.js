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
import Checkbox from "expo-checkbox";
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
  const [sortByDate, setSortByDate] = useState(true);
  const [sortByPrice, setSortByPrice] = useState(false);
  const [multiSliderValue, setMultiSliderValue] = React.useState([5000, 50000]);

  sliderOneValuesChangeFinish = () => setSliderOneChanging(false);

  multiSliderValuesChange = (values) => setMultiSliderValue(values);

  return (
    <View style={styles.container}>
      <AppText style={styles.header}>Sort Listings</AppText>

      <ScrollView scrollEnabled={sliderScrollEnabled}>
        <View
          style={{ ...styles.sectionContainer, opacity: sortByDate ? 1 : 0.5 }}
        >
          <View style={styles.sectionHeaderContainer}>
            <Checkbox
              value={sortByDate}
              onValueChange={(value) => {
                setSortByDate(value);
                setSortByPrice(!value);
              }}
            />
            <AppText style={styles.sectionHeader}>Date</AppText>
          </View>

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
          <View style={styles.fieldContainer}>
            <AppText style={styles.labelText}>Order: </AppText>
            <TouchableOpacity
              onPress={() => {
                setActiveSort({
                  ...activeSort,
                  order: activeSort.order === "asc" ? "desc" : "asc",
                });
              }}
              style={styles.feildValueContainer}
            >
              <AppText style={styles.fieldValueText}>
                {activeSort.order === "asc" ? "Old to New" : "New to Old"}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{ ...styles.sectionContainer, opacity: sortByPrice ? 1 : 0.5 }}
        >
          <View style={styles.sectionHeaderContainer}>
            <Checkbox
              value={sortByPrice}
              onValueChange={(value) => {
                setSortByPrice(value);
                setSortByDate(!value);
              }}
            />
            <AppText style={styles.sectionHeader}>Price</AppText>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.labelText}>Minimum:</Text>
            <View style={styles.feildValueContainer}>
              <AppText style={styles.fieldValueText}>
                {currencyFormatter(multiSliderValue[0])}
              </AppText>
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.labelText}>Maximum:</Text>
            <View style={styles.feildValueContainer}>
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
              values={[multiSliderValue[0], multiSliderValue[1]]}
              sliderLength={250}
              onValuesChange={multiSliderValuesChange}
              min={0}
              max={500000}
              step={10000}
              allowOverlap={false}
              customMarker={() => (
                <View
                  style={{
                    width: 6,
                    height: 25,
                    backgroundColor: colors.secondary,
                    borderRadius: 10,
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
              style={styles.feildValueContainer}
            >
              <AppText style={styles.fieldValueText}>
                {activeSort.order === "asc" ? "Low to Hight" : "High to Low"}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            alignSelf: "center",
            justifyContent: "center",
            width: "50%",
            margin: 20,
          }}
        >
          <AppButton
            title='Apply'
            onPress={() => {
              toggleModal();
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {},
  container: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
  },
  fieldContainer: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 7,
  },
  feildValueContainer: {
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
    margin: 20,
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
