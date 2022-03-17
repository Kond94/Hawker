import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

import expoPushTokensApi from "../api/expoPushTokens";

export default useNotifications = (notificationListener) => {
  useEffect(() => {
    registerForPushNotifications();

    if (notificationListener) Notifications.addListener(notificationListener);
  }, []);

  const registerForPushNotifications = async () => {
    try {
      if (Constants.isDevice) {
        const permission = await Notifications.requestPermissionsAsync();
        if (!permission.granted) return;

        const token = await Notifications.getExpoPushTokenAsync();
        expoPushTokensApi.register(token);
      }
    } catch (error) {
      console.log("Error getting a push token", error);
    }
  };
};
