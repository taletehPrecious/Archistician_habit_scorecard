/* AuthContext.js ensures that every component can access and update
the authentication status of the user throughout the app */

import { createContext } from "react";

const AuthContext = createContext({
  auth: { authenticated: false, user: null },
  setAuth: () => {}
});

export default AuthContext;

