import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import AppText from "../components/Text";
import { AuthenticatedUserContext } from "../auth/AuthenticatedUserProvider";
import { ListItem } from "../components/ListItem";
import ListItemSeparator from "../components/lists/ListItemSeparator";
import React from "react";
import { database } from "../config/firebase";
import { getAuth } from "firebase/auth";
import routes from "../navigation/routes";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";

function ChatList({ navigation }) {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [conversations, setConversations] = useState([]);
  useEffect(() => {
    const collectionRef = collection(database, "Conversations");

    const q = query(collectionRef, orderBy("editedAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setConversations(
        querySnapshot.docs.map((doc) => ({
          _id: doc.data()._id,
          editedAt: doc.data().editedAt,
          messages: doc.data().messages,
          buyer: doc.data().buyer,
          seller: doc.data().seller,
        }))
      );
    });

    return () => unsubscribe();
  }, []);
  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        keyExtractor={(conversation) => conversation._id.toString()}
        renderItem={({ item }) => (
          <View style={{ margin: 30, alignItems: "center" }}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(routes.CHATS, {
                  messages: item.messages,
                  conversationId: item._id,
                })
              }
            >
              <AppText>
                {user.uid === item.buyer ? item.seller : item.buyer}
              </AppText>
            </TouchableOpacity>
          </View>
        )}
        ItemSeparatorComponent={ListItemSeparator}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {},
});

export default ChatList;
