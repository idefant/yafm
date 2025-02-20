import { Base } from '#types/baseType';
import { Commit, updatedBaseMethods } from '#types/commitType';
import { mapMerge, remove } from '#utils/arrays';
import { objMap } from '#utils/objMap';

export const compileBase = (commits: Commit[]) => {
  if (!updatedBaseMethods.some((method) => method === commits[0].actions[0].method)) return;

  return commits.reduce(
    (acc: Base, commit) => {
      commit.actions.forEach((action) => {
        // === Currency ===
        if (action.method === 'set_main_currency') {
          acc.mainCurrencyCode = action.data.code;
        }
        if (action.method === 'create_currency') {
          acc.currencies.push(action.data);
        }
        if (action.method === 'update_currency') {
          mapMerge(
            acc.currencies,
            (currency) => currency.code === action.data.code,
            objMap(action.data, (value) => value ?? undefined),
          );
        }
        if (action.method === 'delete_currency') {
          remove(acc.currencies, (currency) => currency.code === action.data.code);
        }

        // === Account Group ===
        if (action.method === 'create_account_group') {
          acc.accountGroups.push(action.data);
        }
        if (action.method === 'update_account_group') {
          mapMerge(
            acc.accountGroups,
            (group) => group.id === action.data.id,
            objMap(action.data, (value) => value ?? undefined),
          );
        }
        if (action.method === 'delete_account_group') {
          remove(acc.accountGroups, (group) => group.id === action.data.id);
        }

        // === Account ===
        if (action.method === 'create_account') {
          acc.accounts.push(action.data);
        }
        if (action.method === 'update_account') {
          mapMerge(
            acc.accounts,
            (account) => account.id === action.data.id,
            objMap(action.data, (value) => value ?? undefined),
          );
        }
        if (action.method === 'delete_account') {
          remove(acc.accounts, (account) => account.id === action.data.id);
        }

        // === Category ===
        if (action.method === 'create_category') {
          acc.categories.push(action.data);
        }
        if (action.method === 'update_category') {
          mapMerge(
            acc.categories,
            (category) => category.id === action.data.id,
            objMap(action.data, (value) => value ?? undefined),
          );
        }
        if (action.method === 'delete_category') {
          remove(acc.categories, (category) => category.id === action.data.id);
        }

        // === Template ===
        if (action.method === 'create_template') {
          acc.templates.push(action.data);
        }
        if (action.method === 'update_template') {
          mapMerge(
            acc.templates,
            (template) => template.id === action.data.id,
            objMap(action.data, (value) => value ?? undefined),
          );
        }
        if (action.method === 'delete_template') {
          remove(acc.templates, (template) => template.id === action.data.id);
        }

        // === Transaction ===
        if (action.method === 'create_transaction') {
          acc.transactions.push(action.data);
        }
        if (action.method === 'update_transaction') {
          mapMerge(
            acc.transactions,
            (transaction) => transaction.id === action.data.id,
            objMap(action.data, (value) => value ?? undefined),
          );
        }
        if (action.method === 'delete_transaction') {
          remove(acc.transactions, (transaction) => transaction.id === action.data.id);
        }

        // === Base ===
        if (
          action.method === 'init_base' ||
          action.method === 'import_base' ||
          action.method === 'change_password'
        ) {
          acc = action.data;
        }
      });

      return acc;
    },
    {
      currencies: [],
      mainCurrencyCode: '',
      accountGroups: [],
      accounts: [],
      categories: [],
      templates: [],
      transactions: [],
    },
  );
};
