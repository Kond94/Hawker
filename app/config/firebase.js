import {
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth/react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: Constants.manifest.extra.apiKey,
  authDomain: Constants.manifest.extra.authDomain,
  projectId: Constants.manifest.extra.projectId,
  storageBucket: Constants.manifest.extra.storageBucket,
  messagingSenderId: Constants.manifest.extra.messagingSenderId,
  appId: Constants.manifest.extra.appId,
  databaseURL: Constants.manifest.extra.databaseURL,
};
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const database = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
export const storage = getStorage(app);
