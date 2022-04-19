import { makeAutoObservable } from "mobx";
import { RootStore } from ".";
import { TAccount } from "../types/accountType";
import { v4 as uuid } from "uuid";

class AccountStore {
  rootStore: RootStore;
  accounts: TAccount[] = [];

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  setAccounts(accounts: TAccount[]) {
    this.accounts = accounts;
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

  moveFunds(id: string, sum: number) {
    if (this.accountDict[id]) this.accountDict[id].balance += sum;
  }

  get accountDict() {
    const dict: { [id: string]: TAccount } = {};
    this.accounts.forEach((account) => {
      dict[account.id] = account;
    });
    return dict;
  }
}

export default AccountStore;
