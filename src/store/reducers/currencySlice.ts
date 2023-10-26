import { createSlice } from '@reduxjs/toolkit';

import { defaultCurrencies } from '../../data/defaultCurrencies';
import { TCurrency } from '../../types/currencyType';

type CurrencyState = {
  currencies: TCurrency[];
};

const initialState: CurrencyState = {
  currencies: defaultCurrencies,
};

export const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    clearCurrencyData: () => ({ ...initialState }),
  },
});

export const { clearCurrencyData } = currencySlice.actions;

export default currencySlice.reducer;
