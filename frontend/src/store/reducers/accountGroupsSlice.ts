import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { AccountGroup } from '#types/accountGroupType';

export const accountGroupsAdapter = createEntityAdapter<AccountGroup>({
  selectId: (group) => group.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

export const accountGroupsSlice = createSlice({
  name: 'accountGroups',
  initialState: accountGroupsAdapter.getInitialState(),
  reducers: {
    accountGroupsReceived: accountGroupsAdapter.setAll,
    accountGroupsCleared: accountGroupsAdapter.removeAll,
    accountGroupAdded: accountGroupsAdapter.addOne,
    accountGroupUpdated: accountGroupsAdapter.updateOne,
    accountGroupDeleted: accountGroupsAdapter.removeOne,
  },
});
export const {
  accountGroupsReceived,
  accountGroupsCleared,
  accountGroupAdded,
  accountGroupUpdated,
  accountGroupDeleted,
} = accountGroupsSlice.actions;

export default accountGroupsSlice.reducer;
