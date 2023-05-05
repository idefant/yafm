import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import accountReducer from './reducers/accountSlice';
import appReducer from './reducers/appSlice';
import categoryReducer from './reducers/categorySlice';
import currencyReducer from './reducers/currencySlice';
import transactionReducer from './reducers/transactionSlice';

const persistConfig = {
  key: 'app',
  storage,
  whitelist: ['vaultUrl', 'isVersioningEnabled'],
};

export const rootReducer = combineReducers({
  app: persistReducer(persistConfig, appReducer),
  currency: currencyReducer,
  account: accountReducer,
  transaction: transactionReducer,
  category: categoryReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<() => typeof store>;
export type AppDispatch = AppStore['dispatch'];
