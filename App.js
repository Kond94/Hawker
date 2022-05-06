import { connectToDevTools } from "react-devtools-core";

if (__DEV__) {
  connectToDevTools({
    host: "localhost",
    port: 8097,
  });
}
import React, { useEffect } from "react";

import { LogBox } from "react-native";
import Routes from "./app/navigation/index";

LogBox.ignoreLogs([`Setting a timer for a long period`]);

export default function App() {
  useEffect(() => {}, []);

  return <Routes />;
}
