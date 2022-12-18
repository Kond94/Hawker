import * as Yup from "yup";

import { Form, FormField, SubmitButton } from "./forms";
import { Keyboard, View } from "react-native";
import React, { useEffect, useState } from "react";
import { addDoc, collection, doc, onSnapshot, query } from "firebase/firestore";

import colors from "../config/colors";
import { database } from "../config/firebase";
import { v4 as uuidv4 } from "uuid";

function ContactSellerForm({ buyer, seller, toggleModal }) {
  const [buyerDetails, setBuyerDetails] = useState();
  const [sellerDetails, setSellerDetails] = useState();

  useEffect(() => {
    const buyerSubscriber = onSnapshot(doc(database, "Users", buyer), (doc) => {
      setBuyerDetails(doc.data());
    });

    const sellerSubscriber = onSnapshot(
      doc(database, "Users", seller),
      (doc) => {
        setSellerDetails(doc.data());
      }
    );

    // Unsubscribe from events when no longer in use

    return buyerSubscriber, sellerSubscriber;
  }, []);

  const handleSubmit = async ({ message }, { resetForm }) => {
    addDoc(collection(database, "Messages"), {
      _id: uuidv4(),

      conversationId: buyer + "_" + seller,
      createdAt: new Date(),
      text: message,
      user: {
        _id: buyer,
        avatar: buyerDetails.photoURL,
      },
    }).then(function (docRef) {
      addDoc(collection(database, "Conversations"), {
        _id: buyer + "_" + seller,
        editedAt: new Date(),
        buyer: { _id: buyer, ...buyerDetails },
        seller: { _id: seller, ...sellerDetails },
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
