/* eslint-disable no-param-reassign */
import { createSelector } from '@reduxjs/toolkit';

import { TAccount } from '../types/accountType';
import { TCategory } from '../types/categoryType';
import { TCurrency } from '../types/currencyType';

import { RootState } from './store';

export const selectSafeMode = (state: RootState) => state.app.safeMode;
export const selectArchiveMode = (state: RootState) => state.app.archiveMode;
export const selectIsUnsaved = (state: RootState) => state.app.isUnsaved;
export const selectAccountCategories = (state: RootState) => state.category.accounts;
export const selectTransactionCategories = (state: RootState) => state.category.transactions;
export const selectAccounts = (state: RootState) => state.account.accounts;
export const selectCurrencies = (state: RootState) => state.currency.currencies;
export const selectTransactions = (state: RootState) =>
  [...state.transaction.transactions].sort((a, b) => b.datetime - a.datetime);
export const selectTemplates = (state: RootState) => state.transaction.templates;

export const selectFilteredAccountCategories = createSelector(
  [selectSafeMode, selectArchiveMode, selectAccountCategories],
  (safeMode, archiveMode, categories) =>
    categories.filter(
      (category) => !(safeMode && category.is_hide) && !(!archiveMode && category.is_archive),
    ),
);

export const selectFilteredTransactionCategories = createSelector(
  [selectSafeMode, selectArchiveMode, selectTransactionCategories],
  (safeMode, archiveMode, categories) =>
    categories.filter(
      (category) => !(safeMode && category.is_hide) && !(!archiveMode && category.is_archive),
    ),
);

export const selectTransactionCategoryDict = createSelector(
  [selectTransactionCategories],
  (categories) => {
    const dict: { [id: string]: TCategory } = {};
    categories.forEach((category) => {
      dict[category.id] = category;
    });
    return dict;
  },
);

export const selectHiddenTransactionCategoryIds = createSelector(
  [selectTransactionCategories],
  (categories) =>
    new Set(categories.filter((category) => category.is_hide).map((category) => category.id)),
);

export const selectHiddenAccountCategoryIds = createSelector(
  [selectAccountCategories],
  (categories) =>
    new Set(categories.filter((category) => category.is_hide).map((category) => category.id)),
);

export const selectArchivedAccountCategoryIds = createSelector(
  [selectAccountCategories],
  (categories) =>
    new Set(categories.filter((category) => category.is_archive).map((category) => category.id)),
);

export const selectAccountsWithBalance = createSelector(
  [selectAccounts, selectTransactions],
  (accounts, transactions) => {
    const accountBalancesDict = Object.fromEntries(accounts.map(({ id }) => [id, 0]));

    transactions.forEach((transaction) => {
      transaction.operations.forEach((operation) => {
        accountBalancesDict[operation.account_id] += operation.sum;
      });
    });

    return accounts.map((account) => ({
      ...account,
      balance: accountBalancesDict[account.id],
    }));
  },
);

export const selectAccountDict = createSelector([selectAccountsWithBalance], (accounts) => {
  const dict: { [id: string]: TAccount } = {};
  accounts.forEach((account) => {
    dict[account.id] = account;
  });
  return dict;
});

export const selectHiddenAccountIds = createSelector(
  [selectAccountsWithBalance, selectHiddenAccountCategoryIds],
  (accounts, hiddenCategoryIds) =>
    new Set(
      accounts
        .filter(
          (account) =>
            account.is_hide || (account.category_id && hiddenCategoryIds.has(account.category_id)),
        )
        .map((account) => account.id),
    ),
);

export const selectCurrencyDict = createSelector([selectCurrencies], (currencies) => {
  const dict: { [code: string]: TCurrency } = {};
  currencies.forEach((currency) => {
    dict[currency.code] = currency;
  });
  return dict;
});

export const selectFilteredTransactions = createSelector(
  [selectSafeMode, selectHiddenTransactionCategoryIds, selectHiddenAccountIds, selectTransactions],
  (safeMode, hiddenCategoryIds, hiddenAccountIds, transactions) =>
    transactions.filter((transaction) => {
      if (!safeMode) return true;
      if (transaction.category_id && hiddenCategoryIds.has(transaction.category_id)) return false;

      return !transaction.operations.some((operation) =>
        hiddenAccountIds.has(operation.account_id),
      );
    }),
);

export const selectAccountsLastActivity = createSelector(
  [selectFilteredTransactions],
  (transactions) =>
    transactions.reduce((acc: Record<string, number>, transaction) => {
      transaction.operations.forEach((operation) => {
        if (!(operation.account_id in acc)) {
          acc[operation.account_id] = transaction.datetime;
        }
      });
      return acc;
    }, {}),
);

export const selectFilteredAccounts = createSelector(
  [
    selectSafeMode,
    selectArchiveMode,
    selectAccountsWithBalance,
    selectHiddenAccountCategoryIds,
    selectArchivedAccountCategoryIds,
    selectAccountsLastActivity,
  ],
  (safeMode, archiveMode, accounts, hiddenCategoryIds, archivedCategoryIds, accountsLastActivity) =>
    accounts
      .filter((account) => {
        const isHidden = safeMode && account.is_hide;
        const isArchived = !archiveMode && account.is_archive;
        const isCategoryHidden =
          safeMode && account.category_id && hiddenCategoryIds.has(account.category_id);
        const isCategoryArchived =
          !archiveMode && account.category_id && archivedCategoryIds.has(account.category_id);
        return !(isHidden || isArchived || isCategoryHidden || isCategoryArchived);
      })
      .map((account) => ({
        ...account,
        last_activity: accountsLastActivity?.[account.id],
      })),
);

export const selectFilteredTemplates = createSelector(
  [selectSafeMode, selectHiddenTransactionCategoryIds, selectHiddenAccountIds, selectTemplates],
  (safeMode, hiddenCategoryIds, hiddenAccountIds, templates) =>
    templates.filter((template) => {
      if (!safeMode) return true;
      if (template.category_id && hiddenCategoryIds.has(template.category_id)) return false;

      return !template.operations.some((operation) => hiddenAccountIds.has(operation.account_id));
    }),
);
