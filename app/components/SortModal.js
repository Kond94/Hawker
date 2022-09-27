import React, { Component, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import AppButton from "./Button";
import AppText from "./Text";
import DatePicker from "react-native-date-picker";
import Icon from "./Icon";
import Slider from "@react-native-community/slider";
import colors from "../config/colors";
import { currencyFormatter } from "../utility/numberFormat";

const sortCritera = ["Date", "Price"];
const SortModal = ({ toggleModal, sortListings, sortDetails, allListings }) => {
  const [open, setOpen] = useState(false);
  const renderActiveSort = () => {
    switch (sortDetails.activeSort) {
      case "Date":
        return (
          <View style={styles.tabRenderContainer}>
            <View style={styles.fieldContainer}>
              <AppText style={styles.labelText}>From: </AppText>
              <TouchableOpacity
                onPress={() => setOpen(true)}
                style={styles.feildValueContainer}
              >
                <AppText style={styles.fieldValueText}>
                  {sortDetails.fromDate.toDateString("dd-mmm-yyyy")}
                </AppText>
              </TouchableOpacity>
            </View>
            <DatePicker
              modal
              open={open}
              date={sortDetails.fromDate}
              onConfirm={(date) => {
                setOpen(false);
                sortDetails.setFromDate(date);
              }}
              onCancel={() => {
                setOpen(false);
              }}
              mode='date'
              maximumDate={new Date()}
              // androidVariant='iosClone'
            />
          </View>
        );
      case "Price":
        return (
          <View style={styles.tabRenderContainer}>
            <View style={styles.fieldContainer}>
              <AppText style={styles.labelText}>Minimum Price: </AppText>
              <TouchableOpacity style={styles.feildValueContainer}>
                <AppText style={styles.fieldValueText}>
                  {currencyFormatter(sortDetails.minPrice)}
                </AppText>
              </TouchableOpacity>
            </View>
            <Slider
              style={{ width: 300, height: 50 }}
              minimumValue={0}
              maximumValue={1000000}
              minimumTrackTintColor='#FFFFFF'
              maximumTrackTintColor='#000000'
              onValueChange={(value) => {
                sortDetails.setMinPrice(value);
                sortDetails.setMaxPrice(value + 1000);
              }}
              // value={sortDetails.minPrice}
              step={1000}
              minimumTrackTintColor={colors.primary}
              thumbTintColor={colors.primary}
            />
            <View style={{ flexDirection: "row" }}>
              <AppText style={styles.labelText}>Maximum Price: </AppText>
              <TouchableOpacity style={styles.feildValueContainer}>
                <AppText style={styles.fieldValueText}>
                  {currencyFormatter(sortDetails.maxPrice)}
                </AppText>
              </TouchableOpacity>
            </View>
            <Slider
              style={{ width: 300, height: 50 }}
              minimumValue={1000}
              maximumValue={1001000}
              minimumTrackTintColor='#FFFFFF'
              maximumTrackTintColor='#000000'
              onValueChange={(value) => sortDetails.setMaxPrice(value)}
              // value={sortDetails.maxPrice}
              step={1000}
              minimumTrackTintColor={colors.primary}
              thumbTintColor={colors.primary}
            />
          </View>
        );

      default:
        return <></>;
    }
  };
  return (
    <View style={styles.container}>
      <AppText style={styles.header}>Sort By</AppText>
      <View style={{ alignItems: "center" }}>
        <View style={styles.tabContainer}>
          {sortCritera.map((criteria) => (
            <TouchableOpacity
              key={criteria}
              onPress={() => {
                sortDetails.setActiveSort(criteria);
                criteria === "Date"
                  ? sortDetails.setOrder("New to Old")
                  : sortDetails.setOrder("Low to High");
              }}
            >
              <View
                style={[
                  styles.pillContainer,
                  {
                    borderTopLeftRadius:
                      sortCritera.indexOf(criteria) === 0 ? 10 : 0,
                    borderBottomLeftRadius:
                      sortCritera.indexOf(criteria) === 0 ? 10 : 0,
                    borderTopRightRadius:
                      sortCritera.length === sortCritera.indexOf(criteria)
                        ? 10
                        : 0,
                    borderBottomRightRadius:
                      sortCritera.length === sortCritera.indexOf(criteria)
                        ? 10
                        : 0,
                    backgroundColor:
                      sortDetails.activeSort === criteria
                        ? colors.primary
                        : "#fff",
                  },
                ]}
              >
                <AppText
                  style={[
                    styles.pillText,
                    {
                      color:
                        sortDetails.activeSort === criteria
                          ? colors.white
                          : colors.dark,
                    },
                  ]}
                >
                  {criteria}
                </AppText>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        {renderActiveSort()}
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            alignSelf: "flex-start",
            margin: 13,
          }}
        >
          <AppText
            style={{
              fontSize: 18,
              padding: 3,
              textAlignVertical: "bottom",
            }}
          >
            Order:{" "}
          </AppText>
          {sortDetails.activeSort === "Date" ? (
            <>
              <TouchableOpacity
                onPress={() =>
                  sortDetails.setOrder(
                    sortDetails.order === "Old to New"
                      ? "New to Old"
                      : "Old to New"
                  )
                }
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
                  {sortDetails.order}
                </AppText>
              </TouchableOpacity>
              <Icon
                name={
                  sortDetails.order === "Old to New"
                    ? "sort-calendar-descending"
                    : "sort-calendar-ascending"
                }
                backgroundColor='#0000'
                iconColor='#000'
              />
            </>
          ) : (
            <>
              <TouchableOpacity
                onPress={() =>
                  sortDetails.setOrder(
                    sortDetails.order === "Low to High"
                      ? "High to Low"
                      : "Low to High"
                  )
                }
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
                  {sortDetails.order}
                </AppText>
              </TouchableOpacity>
              <Icon
                name={
                  sortDetails.order === "Low to High"
                    ? "sort-numeric-descending"
                    : "sort-numeric-ascending"
                }
                backgroundColor='#0000'
                iconColor='#000'
              />
            </>
          )}
        </View>
      </View>
      <View
        style={{ alignItems: "center", justifyContent: "flex-end", flex: 1 }}
      >
        <AppButton
          width='50%'
          title='Apply'
          onPress={() => {
            sortListings(allListings), toggleModal();
          }}
        />
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
    alignItems: "flex-start",
    alignSelf: "flex-start",
    margin: 13,
  },
});

export default SortModal;
