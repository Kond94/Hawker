import React from "react";
import Routes from "./app/navigation/index";
import { LogBox } from "react-native";
LogBox.ignoreLogs([`Setting a timer for a long period`]);
export default function App() {
  return <Routes />;
}
