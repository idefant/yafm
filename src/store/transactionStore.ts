import { makeAutoObservable } from "mobx";
import { RootStore } from ".";
import { TTransaction } from "../types/transaction";
import { v4 as uuid } from "uuid";

class TransactionStore {
  rootStore: RootStore;
  transactions: TTransaction[] = [];

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  createTransaction(transaction: Omit<TTransaction, "id">) {
    this.transactions.push({
      id: uuid(),
      ...transaction,
    });
  }

  editTransaction(updatedTransaction: TTransaction) {
    const index = this.transactions.findIndex(
      (transaction) => transaction.id === updatedTransaction.id
    );
    if (index !== -1) {
      this.transactions[index] = updatedTransaction;
    }
  }

  deleteTransaction(id: string) {
    this.transactions = this.transactions.filter(
      (transaction) => transaction.id !== id
    );
  }
}

export default TransactionStore;
