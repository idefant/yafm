import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AppState = {
  archiveMode: boolean;
  crypto?: {
    password: string;
    salt: string;
    encryptionKey: string;
  };
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
    unlockBase(state, { payload }: PayloadAction<Exclude<AppState['crypto'], undefined>>) {
      state.crypto = payload;
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
