import { createSelector } from "@reduxjs/toolkit";

import { TAccount } from "../types/accountType";
import { TCategory } from "../types/categoryType";
import { TCurrency } from "../types/currencyType";
import { RootState } from "./store";

export const selectSafeMode = (state: RootState) => state.app.safeMode;
export const selectArchiveMode = (state: RootState) => state.app.archiveMode;
export const selectIsUnsaved = (state: RootState) => state.app.isUnsaved;
export const selectAccountCategories = (state: RootState) =>
  state.category.accounts;
export const selectTransactionCategories = (state: RootState) =>
  state.category.transactions;
export const selectAccounts = (state: RootState) => state.account.accounts;
export const selectCurrencies = (state: RootState) => state.currency.currencies;
export const selectPrices = (state: RootState) => state.currency.prices;
export const selectFnG = (state: RootState) => state.currency.fng;
export const selectTransactions = (state: RootState) =>
  state.transaction.transactions;
export const selectTemplates = (state: RootState) =>
  state.transaction.templates;

export const selectFilteredAccountCategories = createSelector(
  [selectSafeMode, selectArchiveMode, selectAccountCategories],
  (safeMode, archiveMode, categories) => {
    return categories.filter(
      (category) =>
        !(safeMode && category.is_hide) &&
        !(!archiveMode && category.is_archive)
    );
  }
);

export const selectFilteredTransactionCategories = createSelector(
  [selectSafeMode, selectArchiveMode, selectTransactionCategories],
  (safeMode, archiveMode, categories) => {
    return categories.filter(
      (category) =>
        !(safeMode && category.is_hide) &&
        !(!archiveMode && category.is_archive)
    );
  }
);

export const selectTransactionCategoryDict = createSelector(
  [selectTransactionCategories],
  (categories) => {
    const dict: { [id: string]: TCategory } = {};
    categories.forEach((category) => {
      dict[category.id] = category;
    });
    return dict;
  }
);

export const selectAccountCategoryDict = createSelector(
  [selectAccountCategories],
  (categories) => {
    const dict: { [id: string]: TCategory } = {};
    categories.forEach((category) => {
      dict[category.id] = category;
    });
    return dict;
  }
);

export const selectHiddenTransactionCategoryIds = createSelector(
  [selectTransactionCategories],
  (categories) => {
    return new Set(
      categories
        .filter((category) => category.is_hide)
        .map((category) => category.id)
    );
  }
);

export const selectHiddenAccountCategoryIds = createSelector(
  [selectAccountCategories],
  (categories) => {
    return new Set(
      categories
        .filter((category) => category.is_hide)
        .map((category) => category.id)
    );
  }
);

export const selectAccountsWithBalance = createSelector(
  [selectAccounts, selectTransactions],
  (accounts, transactions) => {
    const dict = accounts.reduce((dict: { [id: string]: number }, account) => {
      dict[account.id] = 0;
      return dict;
    }, {});

    transactions.forEach((transaction) => {
      if (transaction.income) {
        dict[transaction.income.account_id] += transaction.income.sum;
      }
      if (transaction.outcome) {
        dict[transaction.outcome.account_id] -= transaction.outcome.sum;
      }
    });

    return accounts.map((account) => ({
      ...account,
      balance: dict[account.id],
    }));
  }
);

export const selectFilteredAccounts = createSelector(
  [selectSafeMode, selectArchiveMode, selectAccountsWithBalance],
  (safeMode, archiveMode, accounts) => {
    return accounts.filter(
      (account) =>
        !(safeMode && account.is_hide) && !(!archiveMode && account.is_archive)
    );
  }
);

export const selectAccountDict = createSelector(
  [selectAccountsWithBalance],
  (accounts) => {
    const dict: { [id: string]: TAccount } = {};
    accounts.forEach((account) => {
      dict[account.id] = account;
    });
    return dict;
  }
);

export const selectHiddenAccountIds = createSelector(
  [selectAccountsWithBalance, selectHiddenAccountCategoryIds],
  (accounts, hiddenCategoryIds) => {
    return new Set(
      accounts
        .filter(
          (account) =>
            account.is_hide ||
            (account.category_id && hiddenCategoryIds.has(account.category_id))
        )
        .map((account) => account.id)
    );
  }
);

export const selectCurrencyDict = createSelector(
  [selectCurrencies],
  (currencies) => {
    const dict: { [code: string]: TCurrency } = {};
    currencies.forEach((currency) => {
      dict[currency.code] = currency;
    });
    return dict;
  }
);

export const selectFilteredTransactions = createSelector(
  [
    selectSafeMode,
    selectHiddenTransactionCategoryIds,
    selectHiddenAccountIds,
    selectTransactions,
  ],
  (safeMode, hiddenCategoryIds, hiddenAccountIds, transactions) => {
    return transactions.filter(
      (transaction) =>
        !safeMode ||
        !(
          (transaction.category_id &&
            hiddenCategoryIds.has(transaction.category_id)) ||
          (transaction.outcome &&
            hiddenAccountIds.has(transaction.outcome.account_id)) ||
          (transaction.income &&
            hiddenAccountIds.has(transaction.income.account_id))
        )
    );
  }
);

export const selectFilteredTemplates = createSelector(
  [
    selectSafeMode,
    selectHiddenTransactionCategoryIds,
    selectHiddenAccountIds,
    selectTemplates,
  ],
  (safeMode, hiddenCategoryIds, hiddenAccountIds, templates) => {
    return templates.filter(
      (template) =>
        !safeMode ||
        !(
          (template.category_id &&
            hiddenCategoryIds.has(template.category_id)) ||
          (template.outcome &&
            hiddenAccountIds.has(template.outcome.account_id)) ||
          (template.income && hiddenAccountIds.has(template.income.account_id))
        )
    );
  }
);
