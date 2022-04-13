import React from "react";

import { AuthenticatedUserProvider } from "../auth/AuthenticatedUserProvider";
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
