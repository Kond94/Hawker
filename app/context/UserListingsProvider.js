import React, { createContext, useState } from "react";

export const UserListingsContext = createContext({
  userListings: [],
  setUserListings: () => {},
});

export const UserListingsProvider = ({ children }) => {
  const [userListings, setUserListings] = useState([]);

  return (
    <UserListingsContext.Provider value={{ userListings, setUserListings }}>
      {children}
    </UserListingsContext.Provider>
  );
};
