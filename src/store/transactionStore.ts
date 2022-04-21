import { makeAutoObservable } from "mobx";
import { RootStore } from ".";
import { TTransaction } from "../types/transactionType";
import { v4 as uuid } from "uuid";

class TransactionStore {
  rootStore: RootStore;
  transactions: TTransaction[] = [];

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  setTransactions(transactions: TTransaction[]) {
    this.transactions = transactions;
  }

  clearTransactions() {
    this.transactions = [];
  }

  createTransaction(transaction: Omit<TTransaction, "id">) {
    if (transaction.income)
      this.rootStore.account.moveFunds(
        transaction.income.account_id,
        transaction.income.sum
      );
    if (transaction.outcome)
      this.rootStore.account.moveFunds(
        transaction.outcome.account_id,
        -transaction.outcome.sum
      );
    this.transactions.unshift({
      id: uuid(),
      ...transaction,
    });
  }

  editTransaction(updatedTransaction: TTransaction) {
    const index = this.transactions.findIndex(
      (transaction) => transaction.id === updatedTransaction.id
    );
    if (index !== -1) {
      const income = this.transactions[index].income;
      const outcome = this.transactions[index].outcome;
      if (income)
        this.rootStore.account.moveFunds(income.account_id, -income.sum);
      if (outcome)
        this.rootStore.account.moveFunds(outcome.account_id, outcome.sum);

      if (updatedTransaction.income)
        this.rootStore.account.moveFunds(
          updatedTransaction.income.account_id,
          updatedTransaction.income.sum
        );

      if (updatedTransaction.outcome)
        this.rootStore.account.moveFunds(
          updatedTransaction.outcome.account_id,
          -updatedTransaction.outcome.sum
        );

      this.transactions[index] = updatedTransaction;
    }
  }

  deleteTransaction(id: string) {
    this.transactions = this.transactions.filter((transaction) => {
      const isFound = transaction.id === id;
      if (isFound) {
        const income = transaction.income;
        const outcome = transaction.outcome;
        if (income)
          this.rootStore.account.moveFunds(income.account_id, -income.sum);
        if (outcome)
          this.rootStore.account.moveFunds(outcome.account_id, outcome.sum);
      }

      return !isFound;
    });
  }
}

export default TransactionStore;
