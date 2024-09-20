import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AppState = {
  archiveMode: boolean;
  password?: string;
  openedModalsCount: number;
};

const initialState: AppState = {
  archiveMode: false,
  openedModalsCount: 0,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setArchiveMode(state, { payload: archiveMode }: PayloadAction<boolean>) {
      state.archiveMode = archiveMode;
    },
    setPassword(state, { payload: pass }: PayloadAction<string>) {
      state.password = pass;
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
  setPassword,
  lockBase,
  incrementOpenedModalsCount,
  decrementOpenedModalsCount,
} = appSlice.actions;

export default appSlice.reducer;
