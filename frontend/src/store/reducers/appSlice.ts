import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AppState = {
  archiveMode: boolean;
  isBaseUnlocked: boolean;
  openedModalsCount: number;
};

const initialState: AppState = {
  archiveMode: false,
  isBaseUnlocked: false,
  openedModalsCount: 0,
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
    incrementOpenedModalsCount(state) {
      state.openedModalsCount += 1;
    },
    decrementOpenedModalsCount(state) {
      state.openedModalsCount = Math.max(state.openedModalsCount - 1, 0);
    },
  },
});

export const {
  setArchiveMode,
  unlockBase,
  lockBase,
  incrementOpenedModalsCount,
  decrementOpenedModalsCount,
} = appSlice.actions;

export default appSlice.reducer;
