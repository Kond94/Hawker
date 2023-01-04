import React, { createContext, useState } from "react";

export const LikedListingsContext = createContext({
  likedListings: [],
  setLikedListings: () => {},
});

export const LikedListingsProvider = ({ children }) => {
  const [likedListings, setLikedListings] = useState([]);

  return (
    <LikedListingsContext.Provider value={{ likedListings, setLikedListings }}>
      {children}
    </LikedListingsContext.Provider>
  );
};
