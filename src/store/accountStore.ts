import { makeAutoObservable } from "mobx";
import { RootStore } from ".";
import { TAccount } from "../types/accountType";
import { genId } from "../helper/random";

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

  clearAccounts() {
    this.accounts = [];
  }

  createAccount(account: Omit<TAccount, "id" | "balance">) {
    this.accounts.push({
      id: genId(),
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

  recalculateBalances() {
    const accountBalances: { [accountId: string]: number } = {};
    this.accounts.forEach(
      (account) => (accountBalances[account.id] = account.start_balance)
    );

    this.rootStore.transaction.transactions.forEach((transaction) => {
      const income = transaction.income;
      const outcome = transaction.outcome;

      income && (accountBalances[income.account_id] += income.sum);
      outcome && (accountBalances[outcome.account_id] -= outcome.sum);
    });

    let isChanged = false;
    this.accounts.forEach((account) => {
      if (account.balance !== accountBalances[account.id]) {
        account.balance = accountBalances[account.id];
        isChanged = true;
      }
    });

    return isChanged;
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
