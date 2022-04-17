import * as Yup from "yup";

import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from "../components/forms";
import { Image, StyleSheet } from "react-native";
import React, { useState } from "react";

import ActivityIndicator from "../components/ActivityIndicator";
import Firebase from "../config/firebase";
import ImageBackground from "react-native/Libraries/Image/ImageBackground";
import Screen from "../components/Screen";

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

      await Firebase.auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          setLoginFailed(false);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          return setLoginFailed(true);
        });
    }
  };

  return (
    <>
      <ImageBackground
        blurRadius={0.5}
        style={{ flex: 1 }}
        source={require("../assets/app-background.png")}
      >
        {loading && <ActivityIndicator visible={loading} />}
        <Screen style={styles.container}>
          <Image
            style={styles.logo}
            source={require("../assets/logo-primary.png")}
          />
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
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  container: {
    padding: 10,
  },
  logo: {
    width: 110,
    height: 110,
    alignSelf: "center",
    marginTop: 50,
    marginBottom: 20,
  },
});

export default LoginScreen;
