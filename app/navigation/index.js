import { AuthenticatedUserProvider } from "../auth/AuthenticatedUserProvider";
import { CategoriesProvider } from "../context/CategoriesProvider";
import { ListingsProvider } from "../context/ListingsProvider";
import React from "react";
import RootNavigator from "./rootNavigation";
import { UserListingsProvider } from "../context/UserListingsProvider";

/**
 * Wrap all providers here
 */

export default function Routes() {
  return (
    <AuthenticatedUserProvider>
      <CategoriesProvider>
        <ListingsProvider>
          <UserListingsProvider>
            <RootNavigator />
          </UserListingsProvider>
        </ListingsProvider>
      </CategoriesProvider>
    </AuthenticatedUserProvider>
  );
}
