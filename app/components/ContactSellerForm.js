import * as Yup from "yup";

import { Form, FormField, SubmitButton } from "./forms";
import { Keyboard, View } from "react-native";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { auth, database } from "../config/firebase";

import React from "react";
import colors from "../config/colors";
import { v4 as uuidv4 } from "uuid";

function ContactSellerForm({ currentUser, seller, toggleModal }) {
  const handleSubmit = async ({ message }, { resetForm }) => {
    console.log(currentUser, seller, message);

    addDoc(collection(database, "Messages"), {
      _id: uuidv4(),

      conversationId: currentUser + "_" + seller,
      createdAt: new Date(),
      text: message,
      user: {
        _id: currentUser,
        avatar: "https://i.pravatar.cc/300",
      },
    }).then(function (docRef) {
      addDoc(collection(database, "Conversations"), {
        _id: currentUser + "_" + seller,
        editedAt: new Date(),
        messages: [docRef.id],
        buyer: currentUser,
        seller: seller,
      });
    });

    Keyboard.dismiss();
    toggleModal(false);
  };

  return (
    <View
      style={{
        marginVertical: 10,
        width: "85%",
        marginLeft: "auto",
        marginRight: "auto",
        backgroundColor: colors.white,
        borderRadius: 10,
        padding: 15,
      }}
    >
      <Form
        initialValues={{ message: "" }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <FormField
          maxLength={255}
          multiline
          name='message'
          numberOfLines={3}
          placeholder='Message...'
        />
        <SubmitButton title='Contact Seller' />
      </Form>
    </View>
  );
}

const validationSchema = Yup.object().shape({
  message: Yup.string().required().min(1).label("Message"),
});

export default ContactSellerForm;
