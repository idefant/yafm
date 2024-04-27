import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { TAccount } from '#types/accountType';

export const accountsAdapter = createEntityAdapter<TAccount>({
  selectId: (account) => account.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

export const accountsSlice = createSlice({
  name: 'accounts',
  initialState: accountsAdapter.getInitialState(),
  reducers: {
    accountsReceived: accountsAdapter.setAll,
    accountsCleared: accountsAdapter.removeAll,
    accountAdded: accountsAdapter.addOne,
    accountUpdated: accountsAdapter.updateOne,
    accountDeleted: accountsAdapter.removeOne,
  },
});

export const { accountsReceived, accountsCleared, accountAdded, accountUpdated, accountDeleted } =
  accountsSlice.actions;

export default accountsSlice.reducer;
