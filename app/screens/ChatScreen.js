import { Bubble, GiftedChat } from "react-native-gifted-chat";
import React, { useCallback, useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";

import AppText from "../components/Text";
import Appstyles from "../config/Appstyles";
import { AuthenticatedUserContext } from "../auth/AuthenticatedUserProvider";
import Icon from "../components/Icon";
import Screen from "../components/Screen";
import { database } from "../config/firebase";
import { useContext } from "react";

export default function ChatScreen({ route, navigation }) {
  const [messages, setMessages] = useState([]);
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const conversation = route.params.conversation;
  const displayUser =
    user.uid === conversation.buyer._id
      ? conversation.seller
      : conversation.buyer;
  useEffect(() => {
    const collectionRef = collection(database, "Messages");
    const messagesQuery = query(
      collectionRef,
      orderBy("createdAt", "desc"),
      where("conversationId", "==", route.params.conversationId)
    );

    const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
      setMessages(
        querySnapshot.docs.map((doc) => ({
          _id: doc.data()._id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
        }))
      );
    });

    return () => unsubscribe();
  }, []);

  const renderBubble = (props) => {
    return (
      // Step 3: return the component
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            // Here is the color change
            backgroundColor: "#6646ee",
          },
        }}
        textStyle={{
          right: {
            color: "#fff",
          },
        }}
      />
    );
  };

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    const { _id, createdAt, text, user } = messages[0];
    addDoc(collection(database, "Messages"), {
      _id,
      createdAt,
      text,
      user,
      conversationId: route.params.conversationId,
    });
    setDoc(
      doc(database, "Conversations", route.params.conversationId),
      {
        lastMessage: text,
        editedAt: createdAt,
      },
      { merge: true }
    );
  }, []);
  return (
    <Screen>
      <View style={Appstyles.screenHeaderContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name='arrow-left'
            backgroundColor='#0000'
            iconColor='#000'
            circle={false}
          />
        </TouchableOpacity>
        <AppText style={Appstyles.screenHeaderText}>
          {displayUser.displayName}
        </AppText>

        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={() => {}}>
            {/* <Icon
                name='sort'
                backgroundColor='#0000'
                iconColor='#000'
                circle={false}
              /> */}
          </TouchableOpacity>
        </View>
      </View>
      <GiftedChat
        renderBubble={renderBubble}
        messages={messages}
        showAvatarForEveryMessage={true}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: user.uid,
          avatar: user.photoURL,
        }}
      />
    </Screen>
  );
}
