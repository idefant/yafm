import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { exratesApi } from '../api/exratesApi';
import { financeApi } from '../api/financeApi';

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
  [exratesApi.reducerPath]: exratesApi.reducer,
  [financeApi.reducerPath]: financeApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(exratesApi.middleware)
      .concat(financeApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<() => typeof store>;
export type AppDispatch = AppStore['dispatch'];
