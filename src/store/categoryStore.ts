import { makeAutoObservable } from "mobx";
import { RootStore } from ".";
import { genId } from "../helper/random";
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
    this[categoryType].push({ id: genId(), ...category });
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

  get hiddenCategoryIds() {
    const getHiddenSet = (categories: TCategory[]) =>
      new Set(
        categories
          .filter((category) => category.is_hide)
          .map((category) => category.id)
      );
    return {
      transactions: getHiddenSet(this.transactions),
      accounts: getHiddenSet(this.accounts),
    };
  }
}

export default CategoryStore;
