import { compress } from "compress-json";
import { array, object, ValidationError } from "yup";

import { store } from "../store/store";
import { accountSchema } from "../schema/accountSchema";
import { categorySchema } from "../schema/categorySchema";
import { templateSchema, transactionSchema } from "../schema/transactionSchema";
import { TAccount } from "../types/accountType";
import { TCategory } from "../types/categoryType";
import { TTemplate, TTransaction } from "../types/transactionType";

export const getSyncData = (isCompress?: boolean) => {
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

  if (isCompress) {
    return JSON.stringify(compress(JSON.parse(JSON.stringify(data))));
  }
  return JSON.stringify(data);
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
  const validated = await schema
    .validate(data)
    .then(() => undefined)
    .catch((err: ValidationError) => {
      console.log("base object", err.value);
      return { error: err.message };
    });

  if (validated) {
    return validated;
  }

  const getIds = (categories: { id: string }[]) =>
    categories.map((category) => category.id);

  const categoryAccountIds = new Set(getIds(data.categories.accounts));
  if (data.categories.accounts.length !== categoryAccountIds.size) {
    return { error: "Account category IDs are not unique" };
  }

  const categoryTransactionIds = new Set(getIds(data.categories.transactions));
  if (data.categories.transactions.length !== categoryTransactionIds.size) {
    return { error: "Transaction category IDs are not unique" };
  }

  const accountIds = new Set(getIds(data.accounts));
  if (data.accounts.length !== accountIds.size) {
    return { error: "Account IDs are not unique" };
  }

  const transactionIds = new Set(getIds(data.transactions));
  if (data.transactions.length !== transactionIds.size) {
    return { error: "Transaction IDs are not unique" };
  }

  const templateIds = new Set(getIds(data.templates));
  if (data.templates.length !== templateIds.size) {
    return { error: "Template IDs are not unique" };
  }

  for (const account of data.accounts) {
    if (account.category_id && !categoryAccountIds.has(account.category_id)) {
      return {
        error: `There is no account category with id=${account.category_id}`,
      };
    }
  }

  for (const transaction of data.transactions) {
    const categoryId = transaction.category_id;
    if (categoryId && !categoryTransactionIds.has(categoryId)) {
      return {
        error: `There is no transaction category with id=${categoryId}`,
      };
    }

    const income = transaction.income;
    if (income && !accountIds.has(income.account_id)) {
      return { error: `There is no account with id=${income.account_id}` };
    }

    const outcome = transaction.outcome;
    if (outcome && !accountIds.has(outcome.account_id)) {
      return { error: `There is no account with id=${outcome.account_id}` };
    }
  }

  for (const template of data.templates) {
    const categoryId = template.category_id;
    if (categoryId && !categoryTransactionIds.has(categoryId)) {
      return {
        error: `There is no transaction category with id=${categoryId}`,
      };
    }

    const income = template.income;
    if (income && !accountIds.has(income.account_id)) {
      return { error: `There is no account with id=${income.account_id}` };
    }

    const outcome = template.outcome;
    if (outcome && !accountIds.has(outcome.account_id)) {
      return { error: `There is no account with id=${outcome.account_id}` };
    }
  }
};
