import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import { exratesApi } from '#api/exratesApi';
import { financeApi } from '#api/financeApi';
import { mainApi } from '#api/mainApi';

import accountGroupsReducer from './reducers/accountGroupsSlice';
import accountsReducer from './reducers/accountsSlice';
import appReducer from './reducers/appSlice';
import categoriesReducer from './reducers/categoriesSlice';
import currenciesReducer from './reducers/currenciesSlice';
import templatesReducer from './reducers/templatesSlice';
import transactionsReducer from './reducers/transactionsSlice';

export const rootReducer = combineReducers({
  app: appReducer,
  currencies: currenciesReducer,
  accountGroups: accountGroupsReducer,
  accounts: accountsReducer,
  categories: categoriesReducer,
  templates: templatesReducer,
  transactions: transactionsReducer,
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
