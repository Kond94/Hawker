import React, { useEffect } from "react";

import { LogBox } from "react-native";
import Routes from "./app/navigation/index";

LogBox.ignoreLogs([`Setting a timer for a long period`]);

export default function App() {
  useEffect(() => {}, []);

  return <Routes />;
}
