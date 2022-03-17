// force the state to clear with fast refresh in Expo
// @refresh reset

import React, { useEffect, createContext, useState } from "react";
import { database } from "../database/database";

export const ListingContext = createContext({});

export const ListingContextProvider = (props) => {
  // Initial values are obtained from the props
  const { initialListings, children } = props;

  // Use State to store the values
  const [listings, setListings] = useState(initialListings);

  useEffect(() => {
    refreshListings();
  }, []);

  const addNewListing = (listing) => {
    return database.insertListing(listing, refreshListings);
  };

  const refreshListings = () => {
    return database.getListings(setListings);
  };

  // Make the context object:
  const listingContext = {
    listings,
    addNewListing,
  };

  // pass the value in provider and return
  return (
    <ListingContext.Provider value={listingContext}>
      {children}
    </ListingContext.Provider>
  );
};
