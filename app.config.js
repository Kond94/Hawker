import "dotenv/config";

export default {
  expo: {
    name: "hawker",
    plugins: ["@react-native-firebase/app", "expo-community-flipper"],
    slug: "hawker",
    jsEngine: "hermes",
    platforms: ["ios", "android", "web"],
    version: "1.0.0",
    orientation: "portrait",
    icon: "./app/assets/icon.png",
    splash: {
      image: "./app/assets/splash.png",
      resizeMode: "cover",
      backgroundColor: "#FFF",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./app/assets/adaptive-icon.png",
        backgroundColor: "#FFF",
      },
    },
    description: "A marketplace for selling the stuff you don't need anymore.",
    notification: {
      iosDisplayInForeground: true,
    },
    android: {
      package: "com.kond94.hawker",
      googleServicesFile: "./app/config/google-services.json",
    },
    extra: {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
    },
  },
};
