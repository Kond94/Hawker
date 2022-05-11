import auth from "@react-native-firebase/auth";

export const signOut = async () => {
  auth()
    .signOut()
    .then(() => console.log("User signed out!"));
};

export const appUser = auth().currentUser;
