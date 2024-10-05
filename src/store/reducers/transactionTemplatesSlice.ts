import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { TransactionTemplate } from '#types/transactionType';

export const transactionTemplatesAdapter = createEntityAdapter<TransactionTemplate>({
  selectId: (template) => template.id,
});

export const transactionTemplatesSlice = createSlice({
  name: 'transactionTemplates',
  initialState: transactionTemplatesAdapter.getInitialState(),
  reducers: {
    transactionTemplatesReceived: transactionTemplatesAdapter.setAll,
    transactionTemplatesCleared: transactionTemplatesAdapter.removeAll,
    transactionTemplateAdded: transactionTemplatesAdapter.addOne,
    transactionTemplateUpdated: transactionTemplatesAdapter.updateOne,
    transactionTemplateDeleted: transactionTemplatesAdapter.removeOne,
  },
});

export const {
  transactionTemplatesReceived,
  transactionTemplatesCleared,
  transactionTemplateAdded,
  transactionTemplateUpdated,
  transactionTemplateDeleted,
} = transactionTemplatesSlice.actions;

export default transactionTemplatesSlice.reducer;
