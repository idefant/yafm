import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { fetchVaultInfo } from '../actionCreators/appActionCreator';

type AppState = {
  safeMode: boolean;
  archiveMode: boolean;
  isUnsaved: boolean;
  vaultUrl: string;
  password?: string;
  isVaultWorking?: boolean;
  isVersioningEnabled: boolean;
};

const initialState: AppState = {
  safeMode: true,
  archiveMode: false,
  isUnsaved: false,
  vaultUrl: process.env.REACT_APP_DEFAULT_VAULT_URL || '',
  isVersioningEnabled: false,
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
    setVaultUrl(state, { payload: vaultUrl }: PayloadAction<string>) {
      state.vaultUrl = vaultUrl;
      state.isVaultWorking = undefined;
    },
    setPassword(state, { payload: pass }: PayloadAction<string>) {
      state.password = pass;
    },
    lockBase: (state) => ({ ...initialState, vaultUrl: state.vaultUrl }),
  },
  extraReducers: {
    [fetchVaultInfo.fulfilled.type]: (
      state,
      { payload: isVersioningEnabled }: PayloadAction<boolean>,
    ) => {
      state.isVersioningEnabled = isVersioningEnabled;
      state.isVaultWorking = true;
    },
    [fetchVaultInfo.rejected.type]: (state) => {
      state.isVaultWorking = false;
    },
  },
});

export const {
  setSafeMode,
  setArchiveMode,
  setIsUnsaved,
  setVaultUrl,
  setPassword,
  lockBase,
} = appSlice.actions;

export default appSlice.reducer;
