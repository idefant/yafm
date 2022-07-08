import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

import appReducer from "./reducers/appSlice";
import categoryReducer from "./reducers/categorySlice";
import currencyReducer from "./reducers/currencySlice";
import accountReducer from "./reducers/accountSlice";
import transactionReducer from "./reducers/transactionSlice";
import userReducer from "./reducers/userSlice";

export const rootReducer = combineReducers({
  app: appReducer,
  currency: currencyReducer,
  user: userReducer,
  account: accountReducer,
  transaction: transactionReducer,
  category: categoryReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<() => typeof store>;
export type AppDispatch = AppStore["dispatch"];
