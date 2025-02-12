import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AppState = {
  archiveMode: boolean;
  isBaseUnlocked: boolean;
};

const initialState: AppState = {
  archiveMode: false,
  isBaseUnlocked: false,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setArchiveMode(state, { payload: archiveMode }: PayloadAction<boolean>) {
      state.archiveMode = archiveMode;
    },
    unlockBase(state) {
      state.isBaseUnlocked = true;
    },
    lockBase: () => initialState,
  },
});

export const { setArchiveMode, unlockBase, lockBase } = appSlice.actions;

export default appSlice.reducer;
