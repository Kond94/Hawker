import { AuthenticatedUserProvider } from "../auth/AuthenticatedUserProvider";
import Firebase from "../config/firebase";
import React from "react";
import RootNavigator from "./rootNavigation";

/**
 * Wrap all providers here
 */

export default function Routes() {
  return (
    <AuthenticatedUserProvider>
      <RootNavigator />
    </AuthenticatedUserProvider>
  );
}
