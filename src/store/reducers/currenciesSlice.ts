import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { TCurrency } from '#types/currencyType';

export const currenciesAdapter = createEntityAdapter<TCurrency>({
  selectId: (currency) => currency.code,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

export const currenciesSlice = createSlice({
  name: 'currencies',
  initialState: currenciesAdapter.getInitialState(),
  reducers: {
    currenciesReceived: currenciesAdapter.setAll,
    currenciesCleared: currenciesAdapter.removeAll,
  },
});

export const { currenciesReceived, currenciesCleared } = currenciesSlice.actions;

export default currenciesSlice.reducer;
