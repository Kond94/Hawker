import React, { useEffect } from "react";

import { LogBox } from "react-native";
import Routes from "./app/navigation/index";

LogBox.ignoreLogs([`Setting a timer for a long period`]);
LogBox.ignoreLogs(["exported from 'deprecated-react-native-prop-types'."]);
LogBox.ignoreLogs(["Animated: `useNativeDriver` was not specified."]);
LogBox.ignoreLogs([
  "AsyncStorage has been extracted from react-native core and will be removed in a future release. It can now be installed and imported from '@react-native-async-storage/async-storage' instead of 'react-native'. See https://github.com/react-native-async-storage/async-storage.",
]);
export default function App() {
  useEffect(() => {}, []);

  return <Routes />;
}
