import * as Yup from "yup";

import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from "../components/forms";
import { Image, StyleSheet, View } from "react-native";
import React, { useState } from "react";

import LoadingIndicator from "../components/LoadingIndicator";
import Screen from "../components/Screen";
import { auth } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});

function LoginScreen(props) {
  const [loginFailed, setLoginFailed] = useState(false);
  const [loading, setLoading] = useState(false);

  const onLogin = async ({ email, password }) => {
    setLoading(true);

    if (email !== "" && password !== "") {
      setLoginFailed(false);

      await signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          setLoginFailed(false);
        })
        .catch((err) => {
          return setLoginFailed(true);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <>
      {loading && <LoadingIndicator />}

      <Screen>
        <Image
          style={styles.logo}
          source={require("../assets/logo-primary.png")}
        />
        <View style={styles.form}>
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
        </View>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 110,
    height: 110,
    alignSelf: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  form: {
    paddingHorizontal: 10,
  },
});

export default LoginScreen;
