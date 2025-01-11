import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import { EmptyObject, Except } from 'type-fest';

import { mainApi } from '#api/mainApi';
import { store } from '#store';
import {
  accountCategoriesReceived,
  accountCategoryAdded,
  accountCategoryDeleted,
  accountCategoryUpdated,
} from '#store/reducers/accountCategoriesSlice';
import {
  accountAdded,
  accountDeleted,
  accountsReceived,
  accountUpdated,
} from '#store/reducers/accountsSlice';
import {
  currenciesReceived,
  currencyAdded,
  currencyDeleted,
  currencyUpdated,
  defaultCurrencies,
  setBaseCurrency,
  setDefaultCurrencies,
} from '#store/reducers/currenciesSlice';
import {
  transactionCategoriesReceived,
  transactionCategoryAdded,
  transactionCategoryDeleted,
  transactionCategoryUpdated,
} from '#store/reducers/transactionCategoriesSlice';
import {
  transactionAdded,
  transactionDeleted,
  transactionsReceived,
  transactionUpdated,
} from '#store/reducers/transactionsSlice';
import {
  transactionTemplateAdded,
  transactionTemplateDeleted,
  transactionTemplatesReceived,
  transactionTemplateUpdated,
} from '#store/reducers/transactionTemplatesSlice';
import {
  selectAccountById,
  selectAccountCategoryById,
  selectCurrencyById,
  selectTransactionById,
  selectTransactionCategoryById,
  selectTransactionTemplateById,
} from '#store/selectors';
import { Account } from '#types/accountType';
import { Base } from '#types/baseType';
import { Category } from '#types/categoryType';
import { EncryptedData } from '#types/cipher';
import {
  CommitActionDict,
  CommitWithTransforms,
  Transform,
  updatedBaseMethods,
} from '#types/commitType';
import { Currency } from '#types/currencyType';
import { Transaction, TransactionTemplate } from '#types/transactionType';
import { crypt } from '#utils/crypt';
import { getChanges } from '#utils/getChanges';
import Gzip from '#utils/gzip';
import { genId } from '#utils/random';
import { getSyncData } from '#utils/sync';

const runTransforms = async (
  action: CommitActionWithDispatch['action'],
  transforms: Transform[],
) => {
  const newActionData = await transforms.reduce(async (acc, transform) => {
    const transformDict = {
      gzip: () => Gzip.compress(JSON.stringify(acc)),
    };

    if (!(transform in transformDict)) {
      throw new Error('Unknown transform method');
    }
    return transformDict[transform]();
  }, action.data as any);

  return { ...action, data: newActionData, transforms };
};

export type CommitActionWithTransforms = CommitActionWithDispatch['action'] & {
  transforms?: Transform[];
  data: any;
};

const runBackTransforms = async (action: CommitActionWithTransforms) => {
  if (!action.transforms) return action;

  return action.transforms.toReversed().reduce((acc, transform) => {
    const transformDict = {
      gzip: async () => JSON.parse(await Gzip.decompress(acc)),
    };

    if (!(transform in transformDict)) {
      throw new Error('Unknown transform method');
    }
    return transformDict[transform]();
  }, action.data);
};

type CommitActionWithDispatch<
  T extends keyof CommitActionDict = keyof CommitActionDict,
  additionalProps = EmptyObject,
> = {
  dispatchAction?: () => void;
  action: { method: T; data: CommitActionDict[T] };
} & additionalProps;

export const actionCreator = {
  // currency
  setBasicCurrency: (currencyCode: string): CommitActionWithDispatch<'set_basic_currency'> => ({
    dispatchAction: () => store.dispatch(setBaseCurrency(currencyCode)),
    action: { method: 'set_basic_currency', data: { code: currencyCode } },
  }),
  createCurrency: (currency: Currency): CommitActionWithDispatch<'create_currency'> => ({
    dispatchAction: () => store.dispatch(currencyAdded(currency)),
    action: { method: 'create_currency', data: currency },
  }),
  updateCurrency: (
    id: string,
    currency: Partial<Except<Currency, 'code'>>,
  ): CommitActionWithDispatch<'update_currency'> => {
    const oldValue = selectCurrencyById(store.getState(), id);
    const changes = getChanges(oldValue, currency);
    return {
      dispatchAction: () => store.dispatch(currencyUpdated({ id, changes })),
      action: { method: 'update_currency', data: { code: id, ...changes } },
    };
  },
  deleteCurrency: (id: string): CommitActionWithDispatch<'delete_currency'> => ({
    dispatchAction: () => store.dispatch(currencyDeleted(id)),
    action: { method: 'delete_currency', data: { code: id } },
  }),

  // account category
  createAccountCategory: (
    category: Except<Category, 'id'>,
  ): CommitActionWithDispatch<'create_account_category', { id: string }> => {
    const id = genId();
    return {
      dispatchAction: () => store.dispatch(accountCategoryAdded({ id, ...category })),
      action: { method: 'create_account_category', data: { id, ...category } },
      id,
    };
  },
  updateAccountCategory: (
    id: string,
    category: Partial<Except<Category, 'id'>>,
  ): CommitActionWithDispatch<'update_account_category'> => {
    const oldValue = selectAccountCategoryById(store.getState(), id);
    const changes = getChanges(oldValue, category);
    return {
      dispatchAction: () => store.dispatch(accountCategoryUpdated({ id, changes })),
      action: { method: 'update_account_category', data: { id, ...changes } },
    };
  },
  deleteAccountCategory: (id: string): CommitActionWithDispatch<'delete_account_category'> => ({
    dispatchAction: () => store.dispatch(accountCategoryDeleted(id)),
    action: { method: 'delete_account_category', data: { id } },
  }),

  // account
  createAccount: (
    account: Except<Account, 'id'>,
  ): CommitActionWithDispatch<'create_account', { id: string }> => {
    const id = genId();
    return {
      dispatchAction: () => store.dispatch(accountAdded({ id, ...account })),
      action: { method: 'create_account', data: { id, ...account } },
      id,
    };
  },
  updateAccount: (
    id: string,
    account: Partial<Except<Account, 'id'>>,
  ): CommitActionWithDispatch<'update_account'> => {
    const oldValue = selectAccountById(store.getState(), id);
    const changes = getChanges(oldValue, account);
    return {
      dispatchAction: () => store.dispatch(accountUpdated({ id, changes })),
      action: { method: 'update_account', data: { id, ...changes } },
    };
  },
  deleteAccount: (id: string): CommitActionWithDispatch<'delete_account'> => ({
    dispatchAction: () => store.dispatch(accountDeleted(id)),
    action: { method: 'delete_account', data: { id } },
  }),

  // transaction category
  createTransactionCategory: (
    category: Except<Category, 'id'>,
  ): CommitActionWithDispatch<'create_transaction_category', { id: string }> => {
    const id = genId();
    return {
      dispatchAction: () => store.dispatch(transactionCategoryAdded({ id, ...category })),
      action: { method: 'create_transaction_category', data: { id, ...category } },
      id,
    };
  },
  updateTransactionCategory: (
    id: string,
    category: Partial<Except<Category, 'id'>>,
  ): CommitActionWithDispatch<'update_transaction_category'> => {
    const oldValue = selectTransactionCategoryById(store.getState(), id);
    const changes = getChanges(oldValue, category);
    return {
      dispatchAction: () => store.dispatch(transactionCategoryUpdated({ id, changes })),
      action: { method: 'update_transaction_category', data: { id, ...changes } },
    };
  },
  deleteTransactionCategory: (
    id: string,
  ): CommitActionWithDispatch<'delete_transaction_category'> => ({
    dispatchAction: () => store.dispatch(transactionCategoryDeleted(id)),
    action: { method: 'delete_transaction_category', data: { id } },
  }),

  // transaction template
  createTransactionTemplate: (
    template: Except<TransactionTemplate, 'id'>,
  ): CommitActionWithDispatch<'create_transaction_template', { id: string }> => {
    const id = genId();
    return {
      dispatchAction: () => store.dispatch(transactionTemplateAdded({ id, ...template })),
      action: { method: 'create_transaction_template', data: { id, ...template } },
      id,
    };
  },
  updateTransactionTemplate: (
    id: string,
    template: Partial<Except<TransactionTemplate, 'id'>>,
  ): CommitActionWithDispatch<'update_transaction_template'> => {
    const oldValue = selectTransactionTemplateById(store.getState(), id);
    const changes = getChanges(oldValue, template);
    return {
      dispatchAction: () => store.dispatch(transactionTemplateUpdated({ id, changes })),
      action: { method: 'update_transaction_template', data: { id, ...changes } },
    };
  },
  deleteTransactionTemplate: (
    id: string,
  ): CommitActionWithDispatch<'delete_transaction_template'> => ({
    dispatchAction: () => store.dispatch(transactionTemplateDeleted(id)),
    action: { method: 'delete_transaction_template', data: { id } },
  }),

  // transaction
  createTransaction: (
    transaction: Except<Transaction, 'id'>,
  ): CommitActionWithDispatch<'create_transaction', { id: string }> => {
    const id = genId();
    return {
      dispatchAction: () => store.dispatch(transactionAdded({ id, ...transaction })),
      action: { method: 'create_transaction', data: { id, ...transaction } },
      id,
    };
  },
  updateTransaction: (
    id: string,
    transaction: Partial<Except<Transaction, 'id'>>,
  ): CommitActionWithDispatch<'update_transaction'> => {
    const oldValue = selectTransactionById(store.getState(), id);
    const changes = getChanges(oldValue, transaction);
    return {
      dispatchAction: () => store.dispatch(transactionUpdated({ id, changes })),
      action: { method: 'update_transaction', data: { id, ...changes } },
    };
  },
  deleteTransaction: (id: string): CommitActionWithDispatch<'delete_transaction'> => ({
    dispatchAction: () => store.dispatch(transactionDeleted(id)),
    action: { method: 'delete_transaction', data: { id } },
  }),

  // base
  initBase: (): CommitActionWithDispatch<'init_base'> => ({
    dispatchAction: () => store.dispatch(setDefaultCurrencies()),
    action: {
      method: 'init_base',
      data: {
        accounts: [],
        transactions: [],
        templates: [],
        categories: {
          accounts: [],
          transactions: [],
        },
        currencies: defaultCurrencies,
        baseCurrencyCode: '',
      },
    },
  }),
  importBase: (base: Base): CommitActionWithDispatch<'import_base'> => ({
    dispatchAction: () => {
      store.dispatch(currenciesReceived(base.currencies));
      store.dispatch(setBaseCurrency(base.baseCurrencyCode));
      store.dispatch(accountsReceived(base.accounts));
      store.dispatch(accountCategoriesReceived(base.categories.accounts));
      store.dispatch(transactionsReceived(base.transactions));
      store.dispatch(transactionCategoriesReceived(base.categories.transactions));
      store.dispatch(transactionTemplatesReceived(base.templates));
    },
    action: { method: 'import_base', data: base },
  }),
  changePassword: (): CommitActionWithDispatch<'change_password'> => ({
    action: { method: 'change_password', data: getSyncData() },
  }),
};

class Committer {
  actions: CommitActionWithDispatch[];

  date: Date;

  constructor(...actions: CommitActionWithDispatch[]) {
    this.actions = actions;
    this.date = new Date();
    this.actions = actions;
  }

  add(...actions: CommitActionWithDispatch[]) {
    this.actions.push(...actions);
    this.date = new Date();
    return this;
  }

  setDate(date: Date | string) {
    this.date = dayjs(date).toDate();
    return this;
  }

  private async encrypt() {
    if (this.actions.length === 0) {
      throw new Error('Список действий пуст');
    }
    const commitData = {
      actions: await Promise.all(
        this.actions.map(async ({ action, dispatchAction }) => {
          dispatchAction?.();
          return updatedBaseMethods.some((method) => method === action.method)
            ? runTransforms(action, ['gzip'])
            : action;
        }),
      ),
      createdAt: this.date,
    };

    return crypt.encrypt(JSON.stringify(commitData));
  }

  static async decrypt(encryptedData: EncryptedData) {
    const plaintext = await crypt.decrypt(encryptedData);
    if (!plaintext) return;

    const commitData: CommitWithTransforms = JSON.parse(plaintext);

    const transformedActions = await Promise.all(
      commitData.actions.map(async (action) =>
        action.transforms
          ? { method: action.method, data: await runBackTransforms(action) }
          : action,
      ),
    );

    return new Committer(...transformedActions.map((action) => ({ action }))).setDate(
      commitData.createdAt,
    );
  }

  async sync() {
    const { dispatch } = store;
    const encryptedData = await this.encrypt();
    const res = await dispatch(mainApi.endpoints.createCommit.initiate(encryptedData));
    if ('error' in res) {
      Swal.fire({
        title: 'Ошибка сохранения данных',
        icon: 'error',
      });
    }
    return res;
  }
}

export const committer = Object.assign(
  (...props: ConstructorParameters<typeof Committer>) => new Committer(...props),
  { decrypt: Committer.decrypt },
);

// XXX: Добавить метод идентификации бэкендом уже сохраненных коммитов без компрометации данных
//      (желательно детерминированный)
//      а также возможность сбросить старый идентификатор
