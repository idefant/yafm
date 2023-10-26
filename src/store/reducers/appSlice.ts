import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AppState = {
  safeMode: boolean;
  archiveMode: boolean;
  isUnsaved: boolean;
  password?: string;
  isVaultWorking?: boolean;
  openedModalsCount: number;
};

const initialState: AppState = {
  safeMode: true,
  archiveMode: false,
  isUnsaved: false,
  openedModalsCount: 0,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setSafeMode(state, { payload: safeMode }: PayloadAction<boolean>) {
      state.safeMode = safeMode;
    },
    setArchiveMode(state, { payload: archiveMode }: PayloadAction<boolean>) {
      state.archiveMode = archiveMode;
    },
    setIsUnsaved(state, { payload: isUnsaved }: PayloadAction<boolean>) {
      state.isUnsaved = isUnsaved;
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
  setSafeMode,
  setArchiveMode,
  setIsUnsaved,
  setPassword,
  lockBase,
  incrementOpenedModalsCount,
  decrementOpenedModalsCount,
} = appSlice.actions;

export default appSlice.reducer;
