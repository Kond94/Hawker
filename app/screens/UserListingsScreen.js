import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
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
import Appstyles from "../config/Appstyles";
import Icon from "../components/Icon";
import ListItemSeparator from "../components/lists/ListItemSeparator";
import ListingCard from "../components/ListingCard";
import Modal from "react-native-modal";
import Screen from "../components/Screen";
import { UserListingsContext } from "../context/UserListingsProvider";
import { database } from "../config/firebase";
import { useContext } from "react";

function UserListingsScreen({ navigation }) {
  const { userListings } = useContext(UserListingsContext);
  const [isModalVisible, setModalVisible] = useState(false);
  const [listingId, setlistigId] = useState(null);

  const onDelete = async (listing) => {
    setModalVisible(true);
    setlistigId(listing.id);
  };

  const onEdit = (listing) => {
    console.log("Editing... ");
  };
  return (
    <Screen>
      <Modal
        testID={"modal"}
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        onSwipeComplete={() => setModalVisible(false)}
        backdropColor='#B4B3DB'
        backdropOpacity={0.8}
        animationIn='zoomInDown'
        animationOut='zoomOutUp'
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
      >
        <View style={styles.content}>
          <AppText style={styles.contentTitle}>
            Are you sure you want to delete this listing?
          </AppText>
          <AppButton
            title='Delete'
            square
            onPress={async () => {
              console.log("deleting");
              setModalVisible(false);
              await deleteDoc(doc(database, "Listings", listingId));
              setlistigId(null);
            }}
            width={"50%"}
          />
        </View>
      </Modal>
      <View style={Appstyles.screenHeaderContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name='arrow-left'
            backgroundColor='#0000'
            iconColor='#000'
            circle={false}
          />
        </TouchableOpacity>
        <AppText style={Appstyles.screenHeaderText}>My Listings</AppText>

        <View style={{ flexDirection: "row" }}></View>
      </View>
      <View style={{ marginTop: 20 }}>
        <FlatList
          data={userListings}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ListingCard
              editable={{
                onDelete: onDelete,
                onEdit: onEdit,
              }}
              item={item}
              navigation={navigation}
            />
          )}
          ItemSeparatorComponent={ListItemSeparator}
        />
      </View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  content: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  contentTitle: {
    fontSize: 15,
    marginBottom: 12,
  },
});

export default UserListingsScreen;
