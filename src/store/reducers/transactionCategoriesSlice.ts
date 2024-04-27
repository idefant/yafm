import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { TCategory } from '#types/categoryType';

export const transactionCategoriesAdapter = createEntityAdapter<TCategory>({
  selectId: (category) => category.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

export const transactionCategoriesSlice = createSlice({
  name: 'transactionCategories',
  initialState: transactionCategoriesAdapter.getInitialState(),
  reducers: {
    transactionCategoriesReceived: transactionCategoriesAdapter.setAll,
    transactionCategoriesCleared: transactionCategoriesAdapter.removeAll,
    transactionCategoryAdded: transactionCategoriesAdapter.addOne,
    transactionCategoryUpdated: transactionCategoriesAdapter.updateOne,
    transactionCategoryDeleted: transactionCategoriesAdapter.removeOne,
  },
});
export const {
  transactionCategoriesReceived,
  transactionCategoriesCleared,
  transactionCategoryAdded,
  transactionCategoryUpdated,
  transactionCategoryDeleted,
} = transactionCategoriesSlice.actions;

export default transactionCategoriesSlice.reducer;
