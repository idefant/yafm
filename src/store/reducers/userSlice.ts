import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { TApi } from "../../types/userType";

type UserState = {
  api?: TApi;
  aesPass?: string;
};

const initialState: UserState = {};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, { payload }: PayloadAction<TApi>) {
      state.api = payload;
    },
    logoutUser: () => ({ ...initialState }),
    updateTokens(
      state,
      {
        payload: { accessToken, refreshToken },
      }: PayloadAction<{ refreshToken: string; accessToken: string }>
    ) {
      if (state.api) {
        state.api.accessToken = accessToken;
        state.api.refreshToken = refreshToken;
      }
    },
    setAesPass(state, { payload: aesPass }: PayloadAction<string>) {
      state.aesPass = aesPass;
    },
    clearAesPass(state) {
      state.aesPass = undefined;
    },
  },
});

export const { login, logoutUser, updateTokens, setAesPass, clearAesPass } =
  userSlice.actions;

export default userSlice.reducer;
