import { TBase } from '#types/baseType';
import { Commit, updatedBaseMethods } from '#types/commitType';
import { mapMerge, remove } from '#utils/arrays';

export const compileBase = (commits: Commit[]) => {
  if (!updatedBaseMethods.some((method) => method === commits[0].actions[0].method)) return;

  return commits.reduce(
    (acc: TBase, commit) => {
      commit.actions.forEach((action) => {
        // currency
        if (action.method === 'set_basic_currency') {
          acc.baseCurrencyCode = action.data.code;
        }
        if (action.method === 'create_currency') {
          acc.currencies.push(action.data);
        }
        if (action.method === 'update_currency') {
          mapMerge(acc.currencies, (currency) => currency.code === action.data.code, action.data);
        }
        if (action.method === 'delete_currency') {
          remove(acc.currencies, (currency) => currency.code === action.data.code);
        }

        // account category
        if (action.method === 'create_account_category') {
          acc.categories.accounts.push(action.data);
        }
        if (action.method === 'update_account_category') {
          mapMerge(
            acc.categories.accounts,
            (category) => category.id === action.data.id,
            action.data,
          );
        }
        if (action.method === 'delete_account_category') {
          remove(acc.categories.accounts, (category) => category.id === action.data.id);
        }

        // account category
        if (action.method === 'create_account') {
          acc.accounts.push(action.data);
        }
        if (action.method === 'update_account') {
          mapMerge(acc.accounts, (account) => account.id === action.data.id, action.data);
        }
        if (action.method === 'delete_account') {
          remove(acc.accounts, (account) => account.id === action.data.id);
        }

        // transaction category
        if (action.method === 'create_transaction_category') {
          acc.categories.transactions.push(action.data);
        }
        if (action.method === 'update_transaction_category') {
          mapMerge(
            acc.categories.transactions,
            (category) => category.id === action.data.id,
            action.data,
          );
        }
        if (action.method === 'delete_transaction_category') {
          remove(acc.categories.transactions, (category) => category.id === action.data.id);
        }

        // transaction template
        if (action.method === 'create_transaction_template') {
          acc.templates.push(action.data);
        }
        if (action.method === 'update_transaction_template') {
          mapMerge(acc.templates, (template) => template.id === action.data.id, action.data);
        }
        if (action.method === 'delete_transaction_template') {
          remove(acc.templates, (template) => template.id === action.data.id);
        }

        // transaction
        if (action.method === 'create_transaction') {
          acc.transactions.push(action.data);
        }
        if (action.method === 'update_transaction') {
          mapMerge(
            acc.transactions,
            (transaction) => transaction.id === action.data.id,
            action.data,
          );
        }
        if (action.method === 'delete_transaction') {
          remove(acc.transactions, (transaction) => transaction.id === action.data.id);
        }

        // base
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
      accounts: [],
      transactions: [],
      templates: [],
      categories: {
        accounts: [],
        transactions: [],
      },
      currencies: [],
      baseCurrencyCode: '',
    },
  );
};
