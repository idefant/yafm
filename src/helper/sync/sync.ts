import { array, object, ValidationError } from 'yup';

import { accountSchema } from '../../schema/accountSchema';
import { categorySchema } from '../../schema/categorySchema';
import { templateSchema, transactionSchema } from '../../schema/transactionSchema';
import { store } from '../../store/store';
import { TAccount } from '../../types/accountType';
import { TCategory } from '../../types/categoryType';
import { TTemplate, TTransaction } from '../../types/transactionType';

export const getSyncData = () => {
  const {
    account: { accounts },
    transaction: { transactions, templates },
    category,
  } = store.getState();

  const data = {
    accounts,
    transactions,
    categories: {
      accounts: category.accounts,
      transactions: category.transactions,
    },
    templates,
  };

  return data;
};

const schema = object().shape({
  accounts: array().of(accountSchema),
  transactions: array().of(transactionSchema),
  templates: array().of(templateSchema),
  categories: object({
    accounts: array().of(categorySchema),
    transactions: array().of(categorySchema),
  }),
});

export const checkBaseIntegrity = async (data: {
  accounts: TAccount[];
  transactions: TTransaction[];
  templates: TTemplate[];
  categories: { accounts: TCategory[]; transactions: TCategory[] };
}) => {
  const error = await schema
    .validate(data)
    .then(() => undefined)
    .catch((err: ValidationError) => ({ error: err.message }));

  if (error) {
    return error;
  }

  const getIds = (categories: { id: string }[]) => categories.map((category) => category.id);

  const categoryAccountIds = new Set(getIds(data.categories.accounts));
  if (data.categories.accounts.length !== categoryAccountIds.size) {
    return { error: 'Account category IDs are not unique' };
  }

  const categoryTransactionIds = new Set(getIds(data.categories.transactions));
  if (data.categories.transactions.length !== categoryTransactionIds.size) {
    return { error: 'Transaction category IDs are not unique' };
  }

  const accountIds = new Set(getIds(data.accounts));
  if (data.accounts.length !== accountIds.size) {
    return { error: 'Account IDs are not unique' };
  }

  const transactionIds = new Set(getIds(data.transactions));
  if (data.transactions.length !== transactionIds.size) {
    return { error: 'Transaction IDs are not unique' };
  }

  const templateIds = new Set(getIds(data.templates));
  if (data.templates.length !== templateIds.size) {
    return { error: 'Template IDs are not unique' };
  }

  const messages: string[] = [];
  data.accounts.forEach(({ category_id: categoryId }) => {
    if (categoryId && !categoryAccountIds.has(categoryId)) {
      messages.push(`There is no account category with id=${categoryId}`);
    }
  });

  [...data.transactions, ...data.templates].forEach(({
    category_id: categoryId,
    operations,
  }) => {
    if (categoryId && !categoryTransactionIds.has(categoryId)) {
      messages.push(`There is no transaction category with id=${categoryId}`);
    }
    operations.forEach((operation) => {
      if (!accountIds.has(operation.account_id)) {
        messages.push(`There is no account with id=${operation.account_id}`);
      }
    });
  });

  if (messages.length) return ({ error: messages[0] });
  return undefined;
};
