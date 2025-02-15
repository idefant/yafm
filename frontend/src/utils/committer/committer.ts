import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { EmptyObject, Except } from 'type-fest';

import { mainApiCommit } from '#api/mainApi';
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
import { dmodal } from '#ui/Modal';
import { crypt } from '#utils/crypt';
import { getChanges } from '#utils/getChanges';
import Gzip from '#utils/gzip';
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
  ): CommitActionWithDispatch<'update_currency'> | undefined => {
    const oldValue = selectCurrencyById(store.getState(), id);
    if (!oldValue) return;
    const changes = getChanges(oldValue, currency, { onlyKeys: Object.keys(currency) });
    if (changes.isEmpty) return;
    return {
      dispatchAction: () => store.dispatch(currencyUpdated({ id, changes: changes.value })),
      action: { method: 'update_currency', data: { code: id, ...changes.value } },
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
    const id = nanoid();
    return {
      dispatchAction: () => store.dispatch(accountCategoryAdded({ id, ...category })),
      action: { method: 'create_account_category', data: { id, ...category } },
      id,
    };
  },
  updateAccountCategory: (
    id: string,
    category: Partial<Except<Category, 'id'>>,
  ): CommitActionWithDispatch<'update_account_category'> | undefined => {
    const oldValue = selectAccountCategoryById(store.getState(), id);
    if (!oldValue) return;
    const changes = getChanges(oldValue, category, { onlyKeys: Object.keys(category) });
    if (changes.isEmpty) return;
    return {
      dispatchAction: () => store.dispatch(accountCategoryUpdated({ id, changes: changes.value })),
      action: { method: 'update_account_category', data: { id, ...changes.value } },
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
    const id = nanoid();
    return {
      dispatchAction: () => store.dispatch(accountAdded({ id, ...account })),
      action: { method: 'create_account', data: { id, ...account } },
      id,
    };
  },
  updateAccount: (
    id: string,
    account: Partial<Except<Account, 'id' | 'currency_code'>>,
  ): CommitActionWithDispatch<'update_account'> | undefined => {
    const oldValue = selectAccountById(store.getState(), id);
    if (!oldValue) return;
    const changes = getChanges(oldValue, account, { onlyKeys: Object.keys(account) });
    if (changes.isEmpty) return;
    return {
      dispatchAction: () => store.dispatch(accountUpdated({ id, changes: changes.value })),
      action: { method: 'update_account', data: { id, ...changes.value } },
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
    const id = nanoid();
    return {
      dispatchAction: () => store.dispatch(transactionCategoryAdded({ id, ...category })),
      action: { method: 'create_transaction_category', data: { id, ...category } },
      id,
    };
  },
  updateTransactionCategory: (
    id: string,
    category: Partial<Except<Category, 'id'>>,
  ): CommitActionWithDispatch<'update_transaction_category'> | undefined => {
    const oldValue = selectTransactionCategoryById(store.getState(), id);
    if (!oldValue) return;
    const changes = getChanges(oldValue, category, { onlyKeys: Object.keys(category) });
    if (changes.isEmpty) return;
    return {
      dispatchAction: () =>
        store.dispatch(transactionCategoryUpdated({ id, changes: changes.value })),
      action: { method: 'update_transaction_category', data: { id, ...changes.value } },
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
    const id = nanoid();
    return {
      dispatchAction: () => store.dispatch(transactionTemplateAdded({ id, ...template })),
      action: { method: 'create_transaction_template', data: { id, ...template } },
      id,
    };
  },
  updateTransactionTemplate: (
    id: string,
    template: Partial<Except<TransactionTemplate, 'id'>>,
  ): CommitActionWithDispatch<'update_transaction_template'> | undefined => {
    const oldValue = selectTransactionTemplateById(store.getState(), id);
    if (!oldValue) return;
    const changes = getChanges(oldValue, template, { onlyKeys: Object.keys(template) });
    if (changes.isEmpty) return;
    return {
      dispatchAction: () =>
        store.dispatch(transactionTemplateUpdated({ id, changes: changes.value })),
      action: { method: 'update_transaction_template', data: { id, ...changes.value } },
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
    const id = nanoid();
    return {
      dispatchAction: () => store.dispatch(transactionAdded({ id, ...transaction })),
      action: { method: 'create_transaction', data: { id, ...transaction } },
      id,
    };
  },
  updateTransaction: (
    id: string,
    transaction: Partial<Except<Transaction, 'id'>>,
  ): CommitActionWithDispatch<'update_transaction'> | undefined => {
    const oldValue = selectTransactionById(store.getState(), id);
    if (!oldValue) return;
    const changes = getChanges(oldValue, transaction, { onlyKeys: Object.keys(transaction) });
    if (changes.isEmpty) return;
    return {
      dispatchAction: () => store.dispatch(transactionUpdated({ id, changes: changes.value })),
      action: { method: 'update_transaction', data: { id, ...changes.value } },
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

  constructor(...actions: (CommitActionWithDispatch | undefined)[]) {
    this.actions = actions.filter((action): action is CommitActionWithDispatch => !!action);
    this.date = new Date();
  }

  add(...actions: (CommitActionWithDispatch | undefined)[]) {
    this.actions.push(...actions.filter((action): action is CommitActionWithDispatch => !!action));
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
    if (this.actions.length === 0) return;
    const encryptedData = await this.encrypt();
    const res = await dispatch(mainApiCommit.endpoints.createCommit.initiate(encryptedData));
    if ('error' in res) {
      dmodal.error({
        title: 'Ошибка сохранения данных',
        showCancel: false,
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
