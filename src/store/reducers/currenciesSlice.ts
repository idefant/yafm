import { PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { Currency } from '#types/currencyType';

export const defaultCurrencies: Currency[] = [
  {
    code: 'RUB',
    name: 'Ruble',
    decimal_places_number: 2,
    type: 'fiat',
    color: '#b56d00',
    symbol: '₽',
  },
  {
    code: 'USD',
    name: 'US Dollar',
    decimal_places_number: 2,
    type: 'fiat',
    color: '#48a64c',
    symbol: '$',
  },
  {
    code: 'EUR',
    name: 'Euro',
    decimal_places_number: 2,
    type: 'fiat',
    color: '#00349a',
    symbol: '€',
  },
  {
    code: 'BTC',
    name: 'Bitcoin',
    decimal_places_number: 8,
    type: 'crypto',
    color: '#f7931a',
    symbol: '₿',
  },
];

export const currenciesAdapter = createEntityAdapter<Currency>({
  selectId: (currency) => currency.code,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

export const currenciesSlice = createSlice({
  name: 'currencies',
  initialState: currenciesAdapter.getInitialState({ baseCurrencyCode: 'USD' }),
  reducers: {
    currenciesReceived: currenciesAdapter.setAll,
    currenciesCleared: currenciesAdapter.removeAll,
    currencyAdded: currenciesAdapter.addOne,
    currencyUpdated: currenciesAdapter.updateOne,
    currencyDeleted: currenciesAdapter.removeOne,
    setDefaultCurrencies: (state) => {
      currenciesAdapter.setAll(state, defaultCurrencies);
      state.baseCurrencyCode = 'USD';
    },
    setBaseCurrency: (state, action: PayloadAction<string>) => {
      state.baseCurrencyCode = action.payload;
    },
  },
});

export const {
  currenciesReceived,
  currenciesCleared,
  currencyAdded,
  currencyUpdated,
  currencyDeleted,
  setDefaultCurrencies,
  setBaseCurrency,
} = currenciesSlice.actions;

export default currenciesSlice.reducer;
