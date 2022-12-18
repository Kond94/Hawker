import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

import AppText from "../components/Text";
import { AuthenticatedUserContext } from "../auth/AuthenticatedUserProvider";
import ListItemSeparator from "../components/lists/ListItemSeparator";
import React from "react";
import { database } from "../config/firebase";
import routes from "../navigation/routes";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";

function ChatList({ navigation }) {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const conversationsRef = collection(database, "Conversations");
    const conversationsQuery = query(
      conversationsRef,
      orderBy("editedAt", "desc")
    );
    const unsubscribe = onSnapshot(conversationsQuery, (querySnapshot) => {
      let conversations = [];
      querySnapshot.forEach((doc) => {
        if (doc.data()._id.includes(user.uid)) conversations.push(doc.data());
      });
      setConversations(conversations);
    });
    return unsubscribe;
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
                  conversationId: item._id,
                })
              }
            >
              <AppText>
                {user.uid === item.buyer._id
                  ? item.seller.displayName
                  : item.buyer.displayName}
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
