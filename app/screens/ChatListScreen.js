import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

import AppText from "../components/Text";
import Appstyles from "../config/Appstyles";
import { AuthenticatedUserContext } from "../auth/AuthenticatedUserProvider";
import ListItem from "../components/lists/ListItem";
import ListItemDeleteAction from "../components/lists/ListItemDeleteAction";
import ListItemSeparator from "../components/lists/ListItemSeparator";
import React from "react";
import Screen from "../components/Screen";
import { database } from "../config/firebase";
import moment from "moment";
import routes from "../navigation/routes";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";

function ChatListScreen({ navigation }) {
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
    <Screen>
      <View style={Appstyles.screenHeaderContainer}>
        <AppText style={Appstyles.screenHeaderText}>Messages</AppText>

        <View style={{ flexDirection: "row" }}></View>
      </View>
      <FlatList
        data={conversations}
        keyExtractor={(conversation) => conversation._id.toString()}
        renderItem={({ item }) => {
          const displayUser =
            user.uid === item.buyer._id ? item.seller : item.buyer;

          return (
            <ListItem
              title={displayUser.displayName}
              titleRight={moment(item.editedAt.toDate()).fromNow()}
              subTitle={item.lastMessage}
              image={
                displayUser.photoURL
                  ? displayUser.photoURL
                  : "https://ui-avatars.com/api/?background=random&name=" +
                    displayUser.displayName
              }
              onPress={() =>
                navigation.navigate(routes.CHATS, {
                  conversation: item,
                  conversationId: item._id,
                })
              }
              renderRightActions={() => (
                <ListItemDeleteAction onPress={() => handleDelete(item)} />
              )}
            />
          );
        }}
        ItemSeparatorComponent={ListItemSeparator}
      />
    </Screen>
  );
}
const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
});

export default ChatListScreen;
