import { Dictionary, createSelector } from '@reduxjs/toolkit';
import BigNumber from 'bignumber.js';

import { AccountExtended } from '#types/accountType';
import { TemplateExtended } from '#types/templateType';
import { TransactionExtended } from '#types/transactionType';
import { createKeysDict } from '#utils/createKeysDict';
import { getEntities } from '#utils/getEntities';
import { groupBy } from '#utils/groupBy';
import { objMap } from '#utils/objMap';
import { sum } from '#utils/sum';

import { accountGroupsAdapter } from './reducers/accountGroupsSlice';
import { accountsAdapter } from './reducers/accountsSlice';
import { categoriesAdapter } from './reducers/categoriesSlice';
import { currenciesAdapter } from './reducers/currenciesSlice';
import { templatesAdapter } from './reducers/templatesSlice';
import { transactionsAdapter } from './reducers/transactionsSlice';
import { RootState } from './store';

export const selectArchiveMode = (state: RootState) => state.app.archiveMode;

// ..........................
// ===== Entity Adapter =====
// ''''''''''''''''''''''''''
const currenciesSelectors = currenciesAdapter.getSelectors<RootState>((state) => state.currencies);
const accountGroupsSelectors = accountGroupsAdapter.getSelectors<RootState>(
  (state) => state.accountGroups,
);
const accountsSelectors = accountsAdapter.getSelectors<RootState>((state) => state.accounts);
const categoriesSelectors = categoriesAdapter.getSelectors<RootState>((state) => state.categories);
const templatesSelectors = templatesAdapter.getSelectors<RootState>((state) => state.templates);
const transactionsSelectors = transactionsAdapter.getSelectors<RootState>(
  (state) => state.transactions,
);

// ......................
// ===== Currencies =====
// ''''''''''''''''''''''
export const selectCurrencies = currenciesSelectors.selectAll;

export const selectCurrenciesIds = currenciesSelectors.selectIds;

export const selectCurrencyById = currenciesSelectors.selectById;

// ..........................
// ===== Account Groups =====
// ''''''''''''''''''''''''''
export const selectAllAccountGroups = accountGroupsSelectors.selectAll;

export const selectAccountGroupById = accountGroupsSelectors.selectById;

// ....................
// ===== Accounts =====
// ''''''''''''''''''''
export const selectAllAccounts = accountsSelectors.selectAll;

export const selectAllAccountsExtended = createSelector(
  [selectAllAccounts, accountGroupsSelectors.selectEntities, currenciesSelectors.selectEntities],
  (accounts, accountGroupsEntities, currenciesEntities) =>
    accounts.map((account) => ({
      ...account,
      group: account.groupId ? accountGroupsEntities[account.groupId] : undefined,
      currency: currenciesEntities[account.currencyCode]!,
    })) as AccountExtended[],
);

export const selectAllAccountsExtendedEntities = createSelector(
  [selectAllAccountsExtended],
  (accounts) => getEntities(accounts, (account) => account.id),
);

export const selectVisibleAccounts = createSelector(
  [accountsSelectors.selectAll, selectArchiveMode],
  (accounts, archiveMode) => accounts.filter((account) => archiveMode || !account.isArchived),
);

export const selectVisibleAccountsExtended = createSelector(
  [
    selectVisibleAccounts,
    accountGroupsSelectors.selectEntities,
    currenciesSelectors.selectEntities,
  ],
  (accounts, accountGroupsEntities, currenciesEntities) =>
    accounts.map((account) => ({
      ...account,
      group: account.groupId ? accountGroupsEntities[account.groupId] : undefined,
      currency: currenciesEntities[account.currencyCode]!,
    })) as AccountExtended[],
);

export const selectAccountById = accountsSelectors.selectById;

// ......................
// ===== Categories =====
// ''''''''''''''''''''''
export const selectAllCategories = categoriesSelectors.selectAll;

export const selectAllCategoriesEntities = categoriesSelectors.selectEntities;

export const selectVisibleCategories = createSelector(
  [categoriesSelectors.selectAll, selectArchiveMode],
  (categories, archiveMode) => categories.filter((category) => archiveMode || !category.isArchived),
);

export const selectCategoryById = categoriesSelectors.selectById;

// ........................
// ===== Transactions =====
// ''''''''''''''''''''''''
export const selectAllTransactions = transactionsSelectors.selectAll;

export const selectAllTransactionsExtended = createSelector(
  [
    transactionsSelectors.selectAll,
    categoriesSelectors.selectEntities,
    selectAllAccountsExtendedEntities,
  ],
  (transactions, categoriesEntities, accountsEntities) =>
    transactions.map((transaction) => ({
      ...transaction,
      category: transaction.categoryId ? categoriesEntities[transaction.categoryId] : undefined,
      operations: transaction.operations.map((operation) => ({
        ...operation,
        account: accountsEntities[operation.accountId]!,
      })),
    })) as TransactionExtended[],
);

export const selectTransactionById = transactionsSelectors.selectById;

// .....................
// ===== Templates =====
// '''''''''''''''''''''
export const selectAllTemplates = templatesSelectors.selectAll;

export const selectAllTemplatesExtended = createSelector(
  [
    templatesSelectors.selectAll,
    categoriesSelectors.selectEntities,
    selectAllAccountsExtendedEntities,
  ],
  (templates, categoriesEntities, accountsEntities) =>
    templates.map((template) => ({
      ...template,
      category: template.categoryId ? categoriesEntities[template.categoryId] : undefined,
      operations: template.operations.map((operation) => ({
        ...operation,
        account: operation.accountId ? accountsEntities[operation.accountId] : undefined,
      })),
    })) as TemplateExtended[],
);

export const selectTemplateById = templatesSelectors.selectById;

// ....................
// ===== Balances =====
// ''''''''''''''''''''
export const selectAccountsBalanceDict = createSelector(
  [accountsSelectors.selectIds, transactionsSelectors.selectAll],
  (accountsIds, transactions) => {
    const accountsBalanceDict = createKeysDict(accountsIds, BigNumber(0));
    transactions.forEach((transaction) => {
      transaction.operations.forEach((operation) => {
        accountsBalanceDict[operation.accountId] = accountsBalanceDict[operation.accountId].plus(
          operation.sum,
        );
      });
    });
    return accountsBalanceDict as Dictionary<BigNumber>;
  },
);

export const selectCurrenciesBalanceDict = createSelector(
  [selectAccountsBalanceDict, accountsSelectors.selectAll],
  (accountsBalanceDict, accounts) =>
    objMap(
      groupBy(accounts, (account) => account.currencyCode),
      (accounts) => sum(accounts.map((account) => accountsBalanceDict[account.id]!)),
    ),
);

// ...........................
// ===== Last Activities =====
// '''''''''''''''''''''''''''
export const selectAccountsLastActivityDict = createSelector(
  [accountsSelectors.selectIds, transactionsSelectors.selectAll],
  (accountsIds, transactions) => {
    const accountsLastActivityDict = createKeysDict(accountsIds, undefined as number | undefined);
    transactions.forEach((transaction) => {
      transaction.operations.forEach((operation) => {
        if ((accountsLastActivityDict[operation.accountId] || 0) < transaction.datetime) {
          accountsLastActivityDict[operation.accountId] = transaction.datetime;
        }
      });
    });
    return accountsLastActivityDict;
  },
);
