import React, { createContext, useState } from "react";

export const ListingsContext = createContext({
  listings: [],
  setListings: () => {},
});

export const ListingsProvider = ({ children }) => {
  const [listings, setListings] = useState([]);

  return (
    <ListingsContext.Provider value={{ listings, setListings }}>
      {children}
    </ListingsContext.Provider>
  );
};
