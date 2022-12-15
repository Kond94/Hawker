import { StyleSheet, TouchableOpacity, View } from "react-native";

import AppButton from "./Button";
import AppText from "./Text";
import ContactSellerForm from "./ContactSellerForm";
import React from "react";
import colors from "../config/colors";

function ContactModal({ toggleModal }) {
  return (
    <View style={styles.container}>
      <AppText style={styles.header}>Contact Seller</AppText>
      <ContactSellerForm />
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

  header: {
    textAlign: "center",
    fontWeight: "800",
    fontSize: 20,
    marginTop: 20,
  },
});

export default ContactModal;
