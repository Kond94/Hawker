import { Bubble, GiftedChat } from "react-native-gifted-chat";
import React, { useCallback, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { AuthenticatedUserContext } from "../auth/AuthenticatedUserProvider";
import { View } from "react-native";
import { database } from "../config/firebase";
import { useContext } from "react";

export default function Chat({ route, navigation, conversationId }) {
  const [messages, setMessages] = useState([]);
  const { user, setUser } = useContext(AuthenticatedUserContext);

  useEffect(() => {
    const collectionRef = collection(database, "Messages");
    const q = query(
      collectionRef,
      orderBy("createdAt", "desc"),
      where("conversationId", "==", route.params.conversationId)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
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
  }, []);
  return (
    <>
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
      <View style={{ height: 100 }}></View>
    </>
  );
}
