import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { Category } from '#types/categoryType';

export const categoriesAdapter = createEntityAdapter<Category>({
  selectId: (category) => category.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState: categoriesAdapter.getInitialState(),
  reducers: {
    categoriesReceived: categoriesAdapter.setAll,
    categoriesCleared: categoriesAdapter.removeAll,
    categoryAdded: categoriesAdapter.addOne,
    categoryUpdated: categoriesAdapter.updateOne,
    categoryDeleted: categoriesAdapter.removeOne,
  },
});
export const {
  categoriesReceived,
  categoriesCleared,
  categoryAdded,
  categoryUpdated,
  categoryDeleted,
} = categoriesSlice.actions;

export default categoriesSlice.reducer;
