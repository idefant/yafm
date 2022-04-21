import { makeAutoObservable } from "mobx";
import { v4 as uuid } from "uuid";
import { RootStore } from ".";
import { TCategory, TCategoryType } from "../types/categoryType";

class CategoryStore {
  rootStore: RootStore;
  accounts: TCategory[] = [];
  transactions: TCategory[] = [];

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  setCategories({
    accounts,
    transactions,
  }: {
    accounts: TCategory[];
    transactions: TCategory[];
  }) {
    this.accounts = accounts;
    this.transactions = transactions;
  }

  clearCategories() {
    this.accounts = [];
    this.transactions = [];
  }

  createCategory(category: Omit<TCategory, "id">, categoryType: TCategoryType) {
    this[categoryType].push({ id: uuid(), ...category });
  }

  editCategory(updatedCategory: TCategory, categoryType: TCategoryType) {
    const index = this[categoryType].findIndex(
      (category) => category.id === updatedCategory.id
    );
    if (index !== -1) {
      this[categoryType][index] = updatedCategory;
    }
  }

  deleteCategory(id: string, categoryType: TCategoryType) {
    this[categoryType] = this[categoryType].filter(
      (account) => account.id !== id
    );
  }

  get transactionDict() {
    const dict: { [id: string]: TCategory } = {};
    this.transactions.forEach((transaction) => {
      dict[transaction.id] = transaction;
    });
    return dict;
  }

  get accountDict() {
    const dict: { [id: string]: TCategory } = {};
    this.accounts.forEach((account) => {
      dict[account.id] = account;
    });
    return dict;
  }
}

export default CategoryStore;
