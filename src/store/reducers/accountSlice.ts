import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { genId } from "../../helper/random";
import { TAccount } from "../../types/accountType";

type AccountState = {
  accounts: TAccount[];
};

const initialState: AccountState = {
  accounts: [],
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccounts(state, { payload: accounts }: PayloadAction<TAccount[]>) {
      state.accounts = accounts;
    },
    clearAccounts: () => ({ ...initialState }),
    createAccount(
      state,
      { payload: account }: PayloadAction<Omit<TAccount, "id">>
    ) {
      state.accounts.push({ id: genId(), ...account });
    },
    editAccount(
      state,
      {
        payload: updatedAccount,
      }: PayloadAction<Omit<TAccount, "currency_code">>
    ) {
      const index = state.accounts.findIndex(
        (account) => account.id === updatedAccount.id
      );
      if (index !== -1) {
        state.accounts[index] = {
          ...state.accounts[index],
          ...updatedAccount,
        };
      }
    },
    deleteAccount(state, { payload: id }: PayloadAction<string>) {
      state.accounts = state.accounts.filter((account) => account.id !== id);
    },
  },
});

export const {
  setAccounts,
  clearAccounts,
  createAccount,
  editAccount,
  deleteAccount,
} = accountSlice.actions;

export default accountSlice.reducer;
