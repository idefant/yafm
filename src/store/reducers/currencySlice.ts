import { createSlice } from "@reduxjs/toolkit";

import { defaultCurrencies } from "../../data/defaultCurrencies";
import { TCurrency } from "../../types/currencyType";
import { fetchFnG, fetchPrices } from "../actionCreators/currencyActionCreator";

type CurrencyState = {
  currencies: TCurrency[];
  prices?: { [code: string]: number };
  fng?: { value: string; text: string };
};

const initialState: CurrencyState = {
  currencies: defaultCurrencies,
  prices: undefined,
  fng: undefined,
};

export const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    clearCurrencyData: () => ({ ...initialState }),
  },
  extraReducers: {
    [fetchPrices.fulfilled.type]: (state, { payload: prices }) => {
      state.prices = prices;
    },
    [fetchFnG.fulfilled.type]: (state, { payload: fng }) => {
      state.fng = fng;
    },
  },
});

export const { clearCurrencyData } = currencySlice.actions;

export default currencySlice.reducer;
