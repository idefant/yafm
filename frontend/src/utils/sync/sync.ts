import { baseSchema } from '#schema/baseSchema';
import { store } from '#store';
import {
  selectAllAccountGroups,
  selectAllAccounts,
  selectAllTemplates,
  selectAllCategories,
  selectAllTransactions,
  selectCurrencies,
} from '#store/selectors';
import { Base } from '#types/baseType';
import { getProp } from '#utils/getProp';

export const getSyncData = () => {
  const state = store.getState();

  return {
    currencies: selectCurrencies(state),
    mainCurrencyCode: state.currencies.mainCurrencyCode,
    accounts: selectAllAccounts(state),
    accountGroups: selectAllAccountGroups(state),
    categories: selectAllCategories(state),
    templates: selectAllTemplates(state),
    transactions: selectAllTransactions(state),
  };
};

export const checkBaseIntegrity = (data: Base) => {
  const parsingResult = baseSchema.safeParse(data);
  if (!parsingResult.success) {
    return { error: parsingResult.error.message };
  }

  const getKeys = <T>(items: T[], key: string) =>
    new Set(items.map((item) => getProp(item, key) as string));

  const hasNonUniqueKeys = <T>(items: T[], key: string) =>
    getKeys(items, key).size !== items.length;

  if (hasNonUniqueKeys(data.currencies, 'code')) {
    return { error: 'Currency codes are not unique' };
  }
  if (hasNonUniqueKeys(data.accountGroups, 'id')) {
    return { error: 'Account category IDs are not unique' };
  }
  if (hasNonUniqueKeys(data.categories, 'id')) {
    return { error: 'Transaction category IDs are not unique' };
  }
  if (hasNonUniqueKeys(data.accounts, 'id')) {
    return { error: 'Account IDs are not unique' };
  }
  if (hasNonUniqueKeys(data.transactions, 'id')) {
    return { error: 'Transaction IDs are not unique' };
  }
  if (hasNonUniqueKeys(data.templates, 'id')) {
    return { error: 'Template IDs are not unique' };
  }

  const categoryAccountIds = getKeys(data.accountGroups, 'id');
  const categoryTransactionIds = getKeys(data.categories, 'id');
  const accountIds = getKeys(data.accounts, 'id');
  const currencyCodes = getKeys(data.currencies, 'code');

  if (!currencyCodes.has(data.mainCurrencyCode)) {
    return { error: `Unknown main currency (${data.mainCurrencyCode})` };
  }

  const messages: string[] = [];
  data.accounts.forEach(({ groupId, currencyCode }) => {
    if (!currencyCodes.has(currencyCode)) {
      messages.push(`There is no currency with code=${currencyCode}`);
    }
    if (groupId && !categoryAccountIds.has(groupId)) {
      messages.push(`There is no account category with id=${groupId}`);
    }
  });

  [...data.transactions, ...data.templates].forEach(({ categoryId, operations }) => {
    if (categoryId && !categoryTransactionIds.has(categoryId)) {
      messages.push(`There is no transaction category with id=${categoryId}`);
    }
    operations.forEach((operation) => {
      if (operation.accountId && !accountIds.has(operation.accountId)) {
        messages.push(`There is no account with id=${operation.accountId}`);
      }
    });
  });

  if (messages.length) return { error: messages[0] };
};
