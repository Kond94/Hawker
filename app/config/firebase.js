import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

import Constants from "expo-constants";
import firebase from "firebase/compat/app";

// Initialize Firebase
const firebaseConfig = {
  apiKey: Constants.manifest.extra.apiKey,
  authDomain: Constants.manifest.extra.authDomain,
  projectId: Constants.manifest.extra.projectId,
  storageBucket: Constants.manifest.extra.storageBucket,
  messagingSenderId: Constants.manifest.extra.messagingSenderId,
  appId: Constants.manifest.extra.appId,
};

let Firebase;

if (firebase.apps.length === 0) {
  Firebase = firebase.initializeApp(firebaseConfig);
  Firebase.firestore().settings({
    experimentalForceLongPolling: true,
    timestampsInSnapshot: true,
    merge: true,
  });
  Firebase.firestore().enablePersistence();
}

export default Firebase;
