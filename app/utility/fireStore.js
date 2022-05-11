import firestore from "@react-native-firebase/firestore";

export const categoriesCollection = (setCategories) => {
  const subscriber = firestore()
    .collection("Categories")
    .onSnapshot((querySnapShot) => {
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

export const listingsCollection = (
  setListings,
  setFilteredListings,
  setLoading,
  searchText
) => {
  const subscriber = firestore()
    .collection("Listings")
    .orderBy("title", "desc")

    .onSnapshot((querySnapShot) => {
      const listings = [];
      querySnapShot.forEach((item) => {
        listings.push({ id: item.id, ...item.data() });
      });
      setListings(listings);
      setFilteredListings(searchText);
      setLoading(false);
    });
  return subscriber;
};

export const storesCollection = (setStores) => {
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

export const usersCollections = (author, setAuthor) => {
  const subscriber = firestore()
    .collection("Users")
    .doc(author)
    .onSnapshot((documentSnapshot) => {
      console.log(documentSnapshot.data());
      setAuthor(documentSnapshot.data());
    });

  return subscriber;
};

export const authorListingCollection = (author, setAuthorListings) => {
  const subscriber = firestore()
    .collection("Listings")
    .where("author", "==", author)
    .onSnapshot((querySnapShot) => {
      const listings = [];
      querySnapShot.forEach((item) => {
        listings.push({ id: item.id, ...item.data() });
      });
      setAuthorListings(listings);
    });

  return subscriber;
};
