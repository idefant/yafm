import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import { exratesApi } from '#api/exratesApi';
import { financeApi } from '#api/financeApi';
import { mainApi } from '#api/mainApi';

import accountCategoriesReducer from './reducers/accountCategoriesSlice';
import accountsReducer from './reducers/accountsSlice';
import appReducer from './reducers/appSlice';
import currenciesReducer from './reducers/currenciesSlice';
import transactionCategoriesReducer from './reducers/transactionCategoriesSlice';
import transactionsReducer from './reducers/transactionsSlice';
import transactionTemplatesReducer from './reducers/transactionTemplatesSlice';

export const rootReducer = combineReducers({
  app: appReducer,
  currencies: currenciesReducer,
  accounts: accountsReducer,
  accountCategories: accountCategoriesReducer,
  transactions: transactionsReducer,
  transactionCategories: transactionCategoriesReducer,
  transactionTemplates: transactionTemplatesReducer,
  [exratesApi.reducerPath]: exratesApi.reducer,
  [financeApi.reducerPath]: financeApi.reducer,
  [mainApi.reducerPath]: mainApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(exratesApi.middleware)
      .concat(financeApi.middleware)
      .concat(mainApi.middleware),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<() => typeof store>;
export type AppDispatch = AppStore['dispatch'];
