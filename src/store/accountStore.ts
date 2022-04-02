import { makeAutoObservable } from "mobx";
import { RootStore } from ".";
import { TAccount } from "../types/account";
import { v4 as uuid } from "uuid";

class AccountStore {
  rootStore: RootStore;
  accounts: TAccount[] = [];

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  createAccount(account: Omit<TAccount, "id" | "balance">) {
    this.accounts.push({
      id: uuid(),
      ...account,
      balance: account.start_balance,
    });
  }

  editAccount(updatedAccount: Omit<TAccount, "balance">) {
    const index = this.accounts.findIndex(
      (account) => account.id === updatedAccount.id
    );
    if (index !== -1) {
      this.accounts[index] = {
        ...updatedAccount,
        balance:
          this.accounts[index].balance +
          updatedAccount.start_balance -
          this.accounts[index].start_balance,
      };
    }
  }

  deleteAccount(id: string) {
    this.accounts = this.accounts.filter((account) => account.id !== id);
  }
}

export default AccountStore;
