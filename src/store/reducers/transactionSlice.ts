import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TTemplate, TTransaction } from '../../types/transactionType';
import { genId } from '../../utils/random';

type TransactionState = {
  transactions: TTransaction[];
  templates: TTemplate[];
};

const initialState: TransactionState = {
  transactions: [],
  templates: [],
};

export const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setTransactions(
      state,
      {
        payload: { transactions, templates },
      }: PayloadAction<{
        transactions: TTransaction[];
        templates: TTemplate[];
      }>,
    ) {
      state.transactions = transactions;
      state.templates = templates;
    },
    clearTransactions: () => ({ ...initialState }),
    createTransaction(state, { payload: transaction }: PayloadAction<Omit<TTransaction, 'id'>>) {
      state.transactions.unshift({ id: genId(), ...transaction });
    },
    editTransaction(state, { payload: updatedTransaction }: PayloadAction<TTransaction>) {
      const index = state.transactions.findIndex(
        (transaction) => transaction.id === updatedTransaction.id,
      );
      if (index !== -1) {
        state.transactions[index] = updatedTransaction;
      }
    },
    deleteTransaction(state, { payload: id }: PayloadAction<string>) {
      state.transactions = state.transactions.filter((transaction) => transaction.id !== id);
    },
    createTemplate(state, { payload: template }: PayloadAction<Omit<TTemplate, 'id'>>) {
      state.templates.unshift({ id: genId(), ...template });
    },
    editTemplate(state, { payload: updatedTemplate }: PayloadAction<TTemplate>) {
      const index = state.templates.findIndex((template) => template.id === updatedTemplate.id);
      if (index !== -1) {
        state.templates[index] = updatedTemplate;
      }
    },
    deleteTemplate(state, { payload: id }: PayloadAction<string>) {
      state.templates = state.templates.filter((template) => template.id !== id);
    },
  },
});

export const {
  setTransactions,
  clearTransactions,
  createTransaction,
  editTransaction,
  deleteTransaction,
  createTemplate,
  editTemplate,
  deleteTemplate,
} = transactionSlice.actions;

export default transactionSlice.reducer;
