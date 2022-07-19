import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { genId } from '../../helper/random';
import { TCategory, TCategoryType } from '../../types/categoryType';

type CategoryState = {
  accounts: TCategory[];
  transactions: TCategory[];
};

const initialState: CategoryState = {
  accounts: [],
  transactions: [],
};

export const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategories(
      state,
      {
        payload: { accounts, transactions },
      }: PayloadAction<{
        accounts: TCategory[];
        transactions: TCategory[];
      }>,
    ) {
      state.accounts = accounts;
      state.transactions = transactions;
    },
    clearCategories: () => ({ ...initialState }),
    createCategory(
      state,
      {
        payload: { category, categoryType },
      }: PayloadAction<{
        category: Omit<TCategory, 'id'>;
        categoryType: TCategoryType;
      }>,
    ) {
      state[categoryType].push({ id: genId(), ...category });
    },
    editCategory(
      state,
      {
        payload: { updatedCategory, categoryType },
      }: PayloadAction<{
        updatedCategory: TCategory;
        categoryType: TCategoryType;
      }>,
    ) {
      const index = state[categoryType].findIndex(
        (category) => category.id === updatedCategory.id,
      );
      if (index !== -1) {
        state[categoryType][index] = updatedCategory;
      }
    },
    deleteCategory(
      state,
      {
        payload: { id, categoryType },
      }: PayloadAction<{ id: string; categoryType: TCategoryType }>,
    ) {
      state[categoryType] = state[categoryType].filter(
        (account) => account.id !== id,
      );
    },
  },
});

export const {
  setCategories,
  clearCategories,
  createCategory,
  editCategory,
  deleteCategory,
} = categorySlice.actions;

export default categorySlice.reducer;
