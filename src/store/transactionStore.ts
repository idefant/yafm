import { makeAutoObservable } from "mobx";
import { RootStore } from ".";
import { genId } from "../helper/random";
import { TTemplate, TTransaction } from "../types/transactionType";

class TransactionStore {
  rootStore: RootStore;
  transactions: TTransaction[] = [];
  templates: TTemplate[] = [];

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  setData(transactions: TTransaction[], templates: TTemplate[]) {
    this.transactions = transactions;
    this.templates = templates;
  }

  clearData() {
    this.transactions = [];
    this.templates = [];
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
      id: genId(),
      ...transaction,
    });
    this.rootStore.app.setIsUnsaved(true);
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
    this.rootStore.app.setIsUnsaved(true);
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
    this.rootStore.app.setIsUnsaved(true);
  }

  createTemplate(template: Omit<TTemplate, "id">) {
    this.templates.unshift({ id: genId(), ...template });
    this.rootStore.app.setIsUnsaved(true);
  }

  editTemplate(updatedTemplate: TTemplate) {
    const index = this.templates.findIndex(
      (template) => template.id === updatedTemplate.id
    );
    if (index !== -1) {
      this.templates[index] = updatedTemplate;
    }
    this.rootStore.app.setIsUnsaved(true);
  }

  deleteTemplate(id: string) {
    this.templates = this.templates.filter((template) => template.id !== id);
    this.rootStore.app.setIsUnsaved(true);
  }

  get filtered() {
    const { safeMode } = this.rootStore.app;
    const hiddenCategoryIds = this.rootStore.category.hiddenCategoryIds;
    const hiddenAccountIds = this.rootStore.account.hiddenAccountIds;

    const filterArr = (arr: (TTransaction | TTemplate)[]) =>
      arr.filter(
        (transaction) =>
          !safeMode ||
          !(
            (transaction.category_id &&
              hiddenCategoryIds.transactions.has(transaction.category_id)) ||
            (transaction.outcome &&
              hiddenAccountIds.has(transaction.outcome.account_id)) ||
            (transaction.income &&
              hiddenAccountIds.has(transaction.income.account_id))
          )
      );

    return {
      transactions: filterArr(this.transactions) as TTransaction[],
      templates: filterArr(this.templates) as TTemplate[],
    };
  }

  get hiddenTemplateIds() {
    return new Set(
      this.templates
        .filter(
          (template) =>
            (template.category_id &&
              this.rootStore.category.hiddenCategoryIds.transactions.has(
                template.category_id
              )) ||
            (template.outcome &&
              this.rootStore.account.hiddenAccountIds.has(
                template.outcome.account_id
              )) ||
            (template.income &&
              this.rootStore.account.hiddenAccountIds.has(
                template.income.account_id
              ))
        )
        .map((template) => template.id)
    );
  }
}

export default TransactionStore;
