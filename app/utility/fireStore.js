import firestore from "@react-native-firebase/firestore";

export const getCategories = (setCategories) => {
  const subscriber = firestore()
    .collection("Categories")
    .onSnapshot((querySnapShot, error) => {
      const categories = [];
      querySnapShot.forEach(async (item) => {
        const category = {
          id: item.id,
          label: item.data().label,
          item: item.data().label,
          icon: item.data().icon,
          backgroundColor: item.data().backgroundColor,
        };
        categories.push(category);
        setCategories(categories);
      });
    });
  return subscriber;
};

export const getListings = (
  setListings,
  setFilteredListings,
  setLoading,
  sortListings,
  activeSort
) => {
  const subscriber = firestore()
    .collection("Listings")
    .orderBy(activeSort.field, activeSort.order)

    .onSnapshot((querySnapShot) => {
      const listings = [];
      querySnapShot.forEach((item) => {
        listings.push({
          id: item.id,
          ...item.data(),
          price: parseInt(item.data().price),
          createdAt: new Date(item.data().createdAt.seconds * 1000),
        });
      });
      setListings(listings);
      setFilteredListings(listings);

      setLoading(false);
    });
  return subscriber;
};

export const getListing = (listingId, setListing) => {
  const subscriber = firestore()
    .collection("Listings")
    .doc(listingId)
    .onSnapshot((documentSnapshot) => {
      setListing(documentSnapshot.data());
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
