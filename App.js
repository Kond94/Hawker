import React, { useEffect } from "react";

import { LogBox } from "react-native";
import Routes from "./app/navigation/index";

LogBox.ignoreLogs([`Setting a timer for a long period`]);
LogBox.ignoreLogs(["exported from 'deprecated-react-native-prop-types'."]);
LogBox.ignoreLogs(["Animated: `useNativeDriver` was not specified."]);
export default function App() {
  useEffect(() => {}, []);

  return <Routes />;
}
