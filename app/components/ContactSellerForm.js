import React from "react";
import { Keyboard } from "react-native";
import * as Yup from "yup";

import { Form, FormField, SubmitButton } from "./forms";

function ContactSellerForm({ listing }) {
  const handleSubmit = async ({ message }, { resetForm }) => {
    Keyboard.dismiss();
  };

  return (
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
  );
}

const validationSchema = Yup.object().shape({
  message: Yup.string().required().min(1).label("Message"),
});

export default ContactSellerForm;
