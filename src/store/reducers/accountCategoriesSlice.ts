import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { TCategory } from '#types/categoryType';

export const accountCategoriesAdapter = createEntityAdapter<TCategory>({
  selectId: (category) => category.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

export const accountCategoriesSlice = createSlice({
  name: 'accountCategories',
  initialState: accountCategoriesAdapter.getInitialState(),
  reducers: {
    accountCategoriesReceived: accountCategoriesAdapter.setAll,
    accountCategoriesCleared: accountCategoriesAdapter.removeAll,
    accountCategoryAdded: accountCategoriesAdapter.addOne,
    accountCategoryUpdated: accountCategoriesAdapter.updateOne,
    accountCategoryDeleted: accountCategoriesAdapter.removeOne,
  },
});
export const {
  accountCategoriesReceived,
  accountCategoriesCleared,
  accountCategoryAdded,
  accountCategoryUpdated,
  accountCategoryDeleted,
} = accountCategoriesSlice.actions;

export default accountCategoriesSlice.reducer;
