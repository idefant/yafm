import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { Template } from '#types/templateType';

export const templatesAdapter = createEntityAdapter<Template>({
  selectId: (template) => template.id,
});

export const templatesSlice = createSlice({
  name: 'templates',
  initialState: templatesAdapter.getInitialState(),
  reducers: {
    templatesReceived: templatesAdapter.setAll,
    templatesCleared: templatesAdapter.removeAll,
    templateAdded: templatesAdapter.addOne,
    templateUpdated: templatesAdapter.updateOne,
    templateDeleted: templatesAdapter.removeOne,
  },
});

export const {
  templatesReceived,
  templatesCleared,
  templateAdded,
  templateUpdated,
  templateDeleted,
} = templatesSlice.actions;

export default templatesSlice.reducer;
