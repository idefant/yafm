import { Dictionary, createSelector } from '@reduxjs/toolkit';
import BigNumber from 'bignumber.js';

import { AccountCombined } from '#types/accountType';
import { TransactionCombined, TransactionTemplateCombined } from '#types/transactionType';
import { createKeysDict } from '#utils/createKeysDict';
import { getEntities } from '#utils/getEntities';
import { groupBy } from '#utils/groupBy';
import { objMap } from '#utils/objMap';
import { sum } from '#utils/sum';

import { accountCategoriesAdapter } from './reducers/accountCategoriesSlice';
import { accountsAdapter } from './reducers/accountsSlice';
import { currenciesAdapter } from './reducers/currenciesSlice';
import { transactionCategoriesAdapter } from './reducers/transactionCategoriesSlice';
import { transactionsAdapter } from './reducers/transactionsSlice';
import { transactionTemplatesAdapter } from './reducers/transactionTemplatesSlice';
import { RootState } from './store';

export const selectArchiveMode = (state: RootState) => state.app.archiveMode;

// ..........................
// ===== Entity Adapter =====
// ''''''''''''''''''''''''''
const currenciesSelectors = currenciesAdapter.getSelectors<RootState>((state) => state.currencies);
const accountsSelectors = accountsAdapter.getSelectors<RootState>((state) => state.accounts);
const accountCategoriesSelectors = accountCategoriesAdapter.getSelectors<RootState>(
  (state) => state.accountCategories,
);
const transactionCategoriesSelectors = transactionCategoriesAdapter.getSelectors<RootState>(
  (state) => state.transactionCategories,
);
const transactionsSelectors = transactionsAdapter.getSelectors<RootState>(
  (state) => state.transactions,
);
const transactionTemplatesSelectors = transactionTemplatesAdapter.getSelectors<RootState>(
  (state) => state.transactionTemplates,
);

// ......................
// ===== Currencies =====
// ''''''''''''''''''''''
export const selectCurrencies = currenciesSelectors.selectAll;

export const selectCurrenciesIds = currenciesSelectors.selectIds;

export const selectCurrencyById = currenciesSelectors.selectById;

// ..............................
// ===== Account Categories =====
// ''''''''''''''''''''''''''''''
export const selectAllAccountCategories = accountCategoriesSelectors.selectAll;

export const selectVisibleAccountCategories = createSelector(
  [accountCategoriesSelectors.selectAll, selectArchiveMode],
  (categories, archiveMode) => categories.filter((category) => archiveMode || !category.is_archive),
);

export const selectAccountCategoryById = accountCategoriesSelectors.selectById;

// ....................
// ===== Accounts =====
// ''''''''''''''''''''
export const selectAllAccounts = accountsSelectors.selectAll;

export const selectAllAccountsCombined = createSelector(
  [
    selectAllAccounts,
    accountCategoriesSelectors.selectEntities,
    currenciesSelectors.selectEntities,
  ],
  (accounts, categoriesEntities, currenciesEntities) =>
    accounts.map((account) => ({
      ...account,
      category: account.category_id ? categoriesEntities[account.category_id] : undefined,
      currency: currenciesEntities[account.currency_code]!,
    })) as AccountCombined[],
);

export const selectAllAccountsCombinedEntities = createSelector(
  [selectAllAccountsCombined],
  (accounts) => getEntities(accounts, 'id'),
);

export const selectVisibleAccounts = createSelector(
  [accountsSelectors.selectAll, selectArchiveMode],
  (accounts, archiveMode) => accounts.filter((account) => archiveMode || !account.is_archive),
);

export const selectVisibleAccountsCombined = createSelector(
  [
    selectVisibleAccounts,
    accountCategoriesSelectors.selectEntities,
    currenciesSelectors.selectEntities,
  ],
  (accounts, categoriesEntities, currenciesEntities) =>
    accounts.map((account) => ({
      ...account,
      category: account.category_id ? categoriesEntities[account.category_id] : undefined,
      currency: currenciesEntities[account.currency_code]!,
    })) as AccountCombined[],
);

export const selectAccountById = accountsSelectors.selectById;

// ..................................
// ===== Transaction Categories =====
// ''''''''''''''''''''''''''''''''''
export const selectAllTransactionCategories = transactionCategoriesSelectors.selectAll;

export const selectAllTransactionCategoriesEntities = transactionCategoriesSelectors.selectEntities;

export const selectVisibleTransactionCategories = createSelector(
  [transactionCategoriesSelectors.selectAll, selectArchiveMode],
  (categories, archiveMode) => categories.filter((category) => archiveMode || !category.is_archive),
);

export const selectTransactionCategoryById = transactionCategoriesSelectors.selectById;

// ........................
// ===== Transactions =====
// ''''''''''''''''''''''''
export const selectAllTransactions = transactionsSelectors.selectAll;

export const selectAllTransactionsCombined = createSelector(
  [
    transactionsSelectors.selectAll,
    transactionCategoriesSelectors.selectEntities,
    selectAllAccountsCombinedEntities,
  ],
  (transactions, categoriesEntities, accountsEntities) =>
    transactions.map((transaction) => ({
      ...transaction,
      category: transaction.category_id ? categoriesEntities[transaction.category_id] : undefined,
      operations: transaction.operations.map((operation) => ({
        ...operation,
        account: accountsEntities[operation.account_id]!,
      })),
    })) as TransactionCombined[],
);

export const selectTransactionById = transactionsSelectors.selectById;

// .................................
// ===== Transaction Templates =====
// '''''''''''''''''''''''''''''''''
export const selectAllTransactionTemplates = transactionTemplatesSelectors.selectAll;

export const selectAllTransactionTemplatesCombined = createSelector(
  [
    transactionTemplatesSelectors.selectAll,
    transactionCategoriesSelectors.selectEntities,
    selectAllAccountsCombinedEntities,
  ],
  (templates, categoriesEntities, accountsEntities) =>
    templates.map((template) => ({
      ...template,
      category: template.category_id ? categoriesEntities[template.category_id] : undefined,
      operations: template.operations.map((operation) => ({
        ...operation,
        account: accountsEntities[operation.account_id]!,
      })),
    })) as TransactionTemplateCombined[],
);

export const selectTransactionTemplateById = transactionTemplatesSelectors.selectById;

// ....................
// ===== Balances =====
// ''''''''''''''''''''
export const selectAccountsBalanceDict = createSelector(
  [accountsSelectors.selectIds, transactionsSelectors.selectAll],
  (accountsIds, transactions) => {
    const accountsBalanceDict = createKeysDict(accountsIds, BigNumber(0));
    transactions.forEach((transaction) => {
      transaction.operations.forEach((operation) => {
        accountsBalanceDict[operation.account_id] = accountsBalanceDict[operation.account_id].plus(
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
    objMap(groupBy(accounts, 'currency_code'), (currencyCode, accounts) => [
      currencyCode,
      sum(accounts.map((account) => accountsBalanceDict[account.id]!)),
    ]),
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
        if ((accountsLastActivityDict[operation.account_id] || 0) < transaction.datetime) {
          accountsLastActivityDict[operation.account_id] = transaction.datetime;
        }
      });
    });
    return accountsLastActivityDict;
  },
);
