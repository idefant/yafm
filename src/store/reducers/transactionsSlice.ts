import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { Transaction } from '#types/transactionType';

export const transactionsAdapter = createEntityAdapter<Transaction>({
  selectId: (transaction) => transaction.id,
  sortComparer: (a, b) => a.datetime - b.datetime,
});

export const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: transactionsAdapter.getInitialState(),
  reducers: {
    transactionsReceived: transactionsAdapter.setAll,
    transactionsCleared: transactionsAdapter.removeAll,
    transactionAdded: transactionsAdapter.addOne,
    transactionUpdated: transactionsAdapter.updateOne,
    transactionDeleted: transactionsAdapter.removeOne,
  },
});

export const {
  transactionsReceived,
  transactionsCleared,
  transactionAdded,
  transactionUpdated,
  transactionDeleted,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
