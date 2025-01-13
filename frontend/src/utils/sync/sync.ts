import { array, object, string, ValidationError } from 'yup';

import { accountSchema } from '#schema/accountSchema';
import { categorySchema } from '#schema/categorySchema';
import { currencySchema } from '#schema/currencySchema';
import { templateSchema, transactionSchema } from '#schema/transactionSchema';
import { store } from '#store';
import {
  selectAllAccountCategories,
  selectAllAccounts,
  selectAllTransactionTemplates,
  selectAllTransactionCategories,
  selectAllTransactions,
  selectCurrencies,
} from '#store/selectors';
import { Base } from '#types/baseType';
import { getProp } from '#utils/getProp';

export const getSyncData = () => {
  const state = store.getState();

  return {
    accounts: selectAllAccounts(state),
    transactions: selectAllTransactions(state),
    categories: {
      accounts: selectAllAccountCategories(state),
      transactions: selectAllTransactionCategories(state),
    },
    templates: selectAllTransactionTemplates(state),
    currencies: selectCurrencies(state),
    baseCurrencyCode: state.currencies.baseCurrencyCode,
  };
};

const schema = object()
  .shape({
    accounts: array().of(accountSchema).required(),
    transactions: array().of(transactionSchema).required(),
    templates: array().of(templateSchema).required(),
    categories: object({
      accounts: array().of(categorySchema).required(),
      transactions: array().of(categorySchema).required(),
    }).required(),
    currencies: array().of(currencySchema).required(),
    baseCurrencyCode: string().required(),
  })
  .required();

export const checkBaseIntegrity = (data: Base) => {
  try {
    schema.validateSync(data);
  } catch (error) {
    if (error instanceof ValidationError) {
      return { error: error.message };
    }
  }

  const getKeys = <T>(items: T[], key: string) =>
    new Set(items.map((item) => getProp(item, key) as string));

  const hasNonUniqueKeys = <T>(items: T[], key: string) =>
    getKeys(items, key).size !== items.length;

  if (hasNonUniqueKeys(data.currencies, 'code')) {
    return { error: 'Currency codes are not unique' };
  }
  if (hasNonUniqueKeys(data.categories.accounts, 'id')) {
    return { error: 'Account category IDs are not unique' };
  }
  if (hasNonUniqueKeys(data.categories.transactions, 'id')) {
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

  const categoryAccountIds = getKeys(data.categories.accounts, 'id');
  const categoryTransactionIds = getKeys(data.categories.transactions, 'id');
  const accountIds = getKeys(data.accounts, 'id');
  const currencyCodes = getKeys(data.currencies, 'code');

  if (!currencyCodes.has(data.baseCurrencyCode)) {
    return { error: `Unknown base currency (${data.baseCurrencyCode})` };
  }

  const messages: string[] = [];
  data.accounts.forEach(({ category_id: categoryId, currency_code: currencyCode }) => {
    if (!currencyCodes.has(currencyCode)) {
      messages.push(`There is no currency with code=${currencyCode}`);
    }
    if (categoryId && !categoryAccountIds.has(categoryId)) {
      messages.push(`There is no account category with id=${categoryId}`);
    }
  });

  [...data.transactions, ...data.templates].forEach(({ category_id: categoryId, operations }) => {
    if (categoryId && !categoryTransactionIds.has(categoryId)) {
      messages.push(`There is no transaction category with id=${categoryId}`);
    }
    operations.forEach((operation) => {
      if (!accountIds.has(operation.account_id)) {
        messages.push(`There is no account with id=${operation.account_id}`);
      }
    });
  });

  if (messages.length) return { error: messages[0] };
};
