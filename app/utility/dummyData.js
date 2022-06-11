import firestore from "@react-native-firebase/firestore";

export const slides = [
  {
    key: "52 MB",
    title: "Feshion ",
    uri: "https://rukminim1.flixcart.com/image/240/160/k4ss2a80/shoe/p/q/y/dbb22-4-adidas-shopnk-cblack-ftwwht-original-imafnmr4rgf2nrgg.jpeg?q=60",
    backgroundColor: "#febe29",
  },
  {
    key: "14 MB",
    text: "FREE",
    title: "Electronics ",
    uri: "https://rukminim1.flixcart.com/image/744/744/kgqvlow0/smartwatch/5/d/g/storm-android-ios-boat-original-imafwwzpctt2tbgq.jpeg?q=90",
    backgroundColor: "#22bcb5",
  },
  {
    key: "45 MB",
    title: "Home",
    uri: "https://rukminim1.flixcart.com/image/240/240/jefzonk0/rack-shelf/d/j/x/1-flicker-original-imaf3fghgfhep5uk.jpeg?q=60",
    backgroundColor: "#3395ff",
  },
  {
    key: "33 MB",
    title: "Beauty",
    text: "FREE",
    uri: "https://rukminim1.flixcart.com/image/240/142/johi3680/combo-kit/h/m/n/wine-facial-kit-250-10-g-with-5-in-1-face-massager-free-combo-28-original-imaf9x8g6htefmhq.jpeg?q=60",
    backgroundColor: "#f6437b",
  },
  {
    key: "77 MB",
    title: "Appliances ",
    uri: "https://rukminim1.flixcart.com/image/120/120/k2p1q4w0/roti-khakra-maker/v/j/w/rm1001-900-watt-red-gi-shop-original-imaefm5tdfyuqszf.jpeg?q=80",
    backgroundColor: "#febe29",
  },
  {
    key: "52 MB",
    title: "Feshion ",
    uri: "https://rukminim1.flixcart.com/image/240/160/k4ss2a80/shoe/p/q/y/dbb22-4-adidas-shopnk-cblack-ftwwht-original-imafnmr4rgf2nrgg.jpeg?q=60",
    backgroundColor: "#febe29",
  },
  {
    key: "14 MB",
    text: "FREE",
    title: "Electronics ",
    uri: "https://rukminim1.flixcart.com/image/744/744/kgqvlow0/smartwatch/5/d/g/storm-android-ios-boat-original-imafwwzpctt2tbgq.jpeg?q=90",
    backgroundColor: "#22bcb5",
  },
  {
    key: "45 MB",
    title: "Home",
    uri: "https://rukminim1.flixcart.com/image/240/240/jefzonk0/rack-shelf/d/j/x/1-flicker-original-imaf3fghgfhep5uk.jpeg?q=60",
    backgroundColor: "#3395ff",
  },
  {
    key: "33 MB",
    title: "Beauty",
    text: "FREE",
    uri: "https://rukminim1.flixcart.com/image/240/142/johi3680/combo-kit/h/m/n/wine-facial-kit-250-10-g-with-5-in-1-face-massager-free-combo-28-original-imaf9x8g6htefmhq.jpeg?q=60",
    backgroundColor: "#f6437b",
  },
  {
    key: "77 MB",
    title: "Appliances ",
    uri: "https://rukminim1.flixcart.com/image/120/120/k2p1q4w0/roti-khakra-maker/v/j/w/rm1001-900-watt-red-gi-shop-original-imaefm5tdfyuqszf.jpeg?q=80",
    backgroundColor: "#febe29",
  },
];

export const getListings = (setListings, setFilteredListings, setLoading) => {
  const subscriber = firestore()
    .collection("Listings")
    .orderBy("title", "desc")

    .onSnapshot((querySnapShot) => {
      const listings = [];
      querySnapShot.forEach((item) => {
        listings.push({ id: item.id, ...item.data() });
      });
      setListings(listings);
      setFilteredListings(listings);
      setLoading(false);
    });
  return subscriber;
};

export const getStores = (setStores) => {
  const subscriber = firestore()
    .collection("Stores")
    .onSnapshot((querySnapShot) => {
      const stores = [];
      querySnapShot.forEach(async (item) => {
        const store = {
          id: item.id,
          storeName: item.data().storeName,
          storeDescription: item.data().storeDescription,
          storeProducts: item.data().storeProducts,
          storeLocation: item.data().storeLocation,
          storeOwner: item.data().storeOwner,
          storeLogo: item.data().storeLogo,
          storeBackground: item.data().storeBackground,
          storePrimaryColor: item.data().storePrimaryColor,
          storeSecondaryColor: item.data().storeSecondaryColor,
        };
        stores.push(store);
        setStores(stores);
      });
    });
  return subscriber;
};

export const getUser = (userId, setUser) => {
  const subscriber = firestore()
    .collection("Users")
    .doc(userId)
    .onSnapshot((documentSnapshot) => {
      setUser(documentSnapshot.data());
    });

  return subscriber;
};

export const getStore = (storeId, setStore) => {
  const subscriber = firestore()
    .collection("Stores")
    .doc(storeId)
    .onSnapshot((documentSnapshot) => {
      setStore(documentSnapshot.data());
    });

  return subscriber;
};
export const getUserListings = (userId, setAuthorListings) => {
  const subscriber = firestore()
    .collection("Listings")
    .where("author", "==", userId)
    .onSnapshot((querySnapShot) => {
      const listings = [];
      querySnapShot.forEach((item) => {
        listings.push({ id: item.id, ...item.data() });
      });
      setAuthorListings(listings);
    });

  return subscriber;
};
