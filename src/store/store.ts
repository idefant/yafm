import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import appReducer from "./reducers/appSlice";
import categoryReducer from "./reducers/categorySlice";
import currencyReducer from "./reducers/currencySlice";
import accountReducer from "./reducers/accountSlice";
import transactionReducer from "./reducers/transactionSlice";
import userReducer from "./reducers/userSlice";

const persistConfig = {
  key: "user",
  storage,
  whitelist: ["api"],
};

export const rootReducer = combineReducers({
  app: appReducer,
  currency: currencyReducer,
  user: persistReducer(persistConfig, userReducer),
  account: accountReducer,
  transaction: transactionReducer,
  category: categoryReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<() => typeof store>;
export type AppDispatch = AppStore["dispatch"];
