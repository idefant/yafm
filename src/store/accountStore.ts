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

  createAccount(name: string, startBalance: number, disabled: boolean) {
    this.accounts.push({
      id: uuid(),
      name,
      start_balance: startBalance,
      balance: startBalance,
      disabled,
    });
  }

  editAccount(
    id: string,
    name: string,
    startBalance: number,
    disabled: boolean
  ) {
    const foundAccount = this.accounts.find((account) => account.id === id);
    if (foundAccount) {
      foundAccount.name = name;
      foundAccount.start_balance = startBalance;
      foundAccount.disabled = disabled;
    }
  }

  deleteAccount(id: string) {
    this.accounts = this.accounts.filter((account) => account.id !== id);
  }
}

export default AccountStore;
