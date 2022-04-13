import "dotenv/config";

export default {
  expo: {
    name: "Hawker",
    slug: "Hawker",
    platforms: ["ios", "android", "web"],
    version: "1.0.0",
    orientation: "portrait",
    icon: "./app/assets/icon.png",
    splash: {
      image: "./app/assets/splash.png",
      resizeMode: "cover",
      backgroundColor: "#e63c4b",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    description: "A marketplace for selling the stuff you don't need anymore.",
    notification: {
      iosDisplayInForeground: true,
    },
    android: {
      package: "com.kond94.Hawker",
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
