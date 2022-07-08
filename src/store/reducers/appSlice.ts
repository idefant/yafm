import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AppState = {
  safeMode: boolean;
  archiveMode: boolean;
  isUnsaved: boolean;
};

const initialState: AppState = {
  safeMode: true,
  archiveMode: false,
  isUnsaved: false,
};

export const appSlice = createSlice({
  name: "app",
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
    clearData: () => ({ ...initialState }),
  },
});

export const {
  setSafeMode,
  setArchiveMode,
  setIsUnsaved,
  clearData: clearAppDate,
} = appSlice.actions;

export default appSlice.reducer;
