import { createSlice } from '@reduxjs/toolkit';

import { userApi } from '../../api/userApi';
import { TToken } from '../../types/userType';

type UserState = {
  user?: TToken;
};

const initialState: UserState = {};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout(state) {
      state.user = undefined;
    },
  },
  extraReducers(builder) {
    builder.addMatcher(userApi.endpoints.login.matchFulfilled, (state, { payload }) => {
      state.user = payload;
    });
    builder.addMatcher(userApi.endpoints.register.matchFulfilled, (state, { payload }) => {
      state.user = payload;
    });
    builder.addMatcher(userApi.endpoints.changePassword.matchFulfilled, (state, { payload }) => {
      state.user = payload;
    });
    builder.addMatcher(userApi.endpoints.deleteAccount.matchFulfilled, (state) => {
      state.user = undefined;
    });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
