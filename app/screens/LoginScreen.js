import React, { useState } from "react";
import { StyleSheet, Image } from "react-native";
import * as Yup from "yup";
import Firebase from "../config/firebase";

import Screen from "../components/Screen";
import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from "../components/forms";
import ActivityIndicator from "../components/ActivityIndicator";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});

function LoginScreen(props) {
  const [loginFailed, setLoginFailed] = useState(false);

  const onLogin = async ({ email, password }) => {
    try {
      if (email !== "" && password !== "") {
        await Firebase.auth().signInWithEmailAndPassword(email, password);
      }
    } catch (error) {
      return setLoginFailed(true);
    }
    setLoginFailed(false);
  };

  return (
    <>
      <ActivityIndicator visible={false} />
      <Screen style={styles.container}>
        <Image style={styles.logo} source={require("../assets/logo-red.png")} />

        <Form
          initialValues={{ email: "", password: "" }}
          onSubmit={onLogin}
          validationSchema={validationSchema}
        >
          <ErrorMessage
            error='Invalid email and/or password.'
            visible={loginFailed}
          />
          <FormField
            autoCapitalize='none'
            autoCorrect={false}
            icon='email'
            keyboardType='email-address'
            name='email'
            placeholder='Email'
            textContentType='emailAddress'
          />
          <FormField
            autoCapitalize='none'
            autoCorrect={false}
            icon='lock'
            name='password'
            placeholder='Password'
            secureTextEntry
            textContentType='password'
          />
          <SubmitButton title='Login' />
        </Form>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: "center",
    marginTop: 50,
    marginBottom: 20,
  },
});

export default LoginScreen;
