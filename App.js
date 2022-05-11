import React, { useEffect } from "react";

import { LogBox } from "react-native";
import Routes from "./app/navigation/index";
import { connectToDevTools } from "react-devtools-core";

if (__DEV__) {
  connectToDevTools({
    host: "localhost",
    port: 8097,
  });
}

LogBox.ignoreLogs([`Setting a timer for a long period`]);
LogBox.ignoreLogs(["exported from 'deprecated-react-native-prop-types'."]);
LogBox.ignoreLogs(["expo-app-loading is deprecated'"]);
export default function App() {
  useEffect(() => {}, []);

  return <Routes />;
}
