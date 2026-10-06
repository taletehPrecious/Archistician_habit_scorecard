
/*  checkedAuthContext.js ensures that every component can access and update
the checkedAuth (whether user authentication status has been checked) throughout the app */

import { createContext } from "react";

const CheckedAuthContext = createContext({
  checkedAuth: false,
  setCheckedAuth: () => {}
});

export default CheckedAuthContext;