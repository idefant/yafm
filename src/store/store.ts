import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { baseApi } from '#api/baseApi';
import { exratesApi } from '#api/exratesApi';
import { financeApi } from '#api/financeApi';
import { userApi } from '#api/userApi';

import accountCategoriesReducer from './reducers/accountCategoriesSlice';
import accountsReducer from './reducers/accountsSlice';
import appReducer from './reducers/appSlice';
import currenciesReducer from './reducers/currenciesSlice';
import transactionCategoriesReducer from './reducers/transactionCategoriesSlice';
import transactionsReducer from './reducers/transactionsSlice';
import transactionTemplatesReducer from './reducers/transactionTemplatesSlice';
import userReducer from './reducers/userSlice';

const persistConfigApp = {
  key: 'app',
  storage,
  whitelist: ['vaultUrl', 'isVersioningEnabled'],
};

const persistConfigUser = {
  key: 'user',
  storage,
  whitelist: ['user'],
};

export const rootReducer = combineReducers({
  app: persistReducer(persistConfigApp, appReducer),
  user: persistReducer(persistConfigUser, userReducer),
  currencies: currenciesReducer,
  accounts: accountsReducer,
  accountCategories: accountCategoriesReducer,
  transactions: transactionsReducer,
  transactionCategories: transactionCategoriesReducer,
  transactionTemplates: transactionTemplatesReducer,
  [exratesApi.reducerPath]: exratesApi.reducer,
  [financeApi.reducerPath]: financeApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(exratesApi.middleware)
      .concat(financeApi.middleware)
      .concat(userApi.middleware)
      .concat(baseApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<() => typeof store>;
export type AppDispatch = AppStore['dispatch'];
