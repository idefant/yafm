import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { EmptyObject, Except } from 'type-fest';

import { mainApiCommit } from '#api/mainApi';
import Cryptor from '#modules/Cryptor';
import { commitSchema } from '#schema/commitSchema';
import { store } from '#store';
import {
  accountGroupsReceived,
  accountGroupAdded,
  accountGroupDeleted,
  accountGroupUpdated,
} from '#store/reducers/accountGroupsSlice';
import {
  accountAdded,
  accountDeleted,
  accountsReceived,
  accountUpdated,
} from '#store/reducers/accountsSlice';
import {
  categoriesReceived,
  categoryAdded,
  categoryDeleted,
  categoryUpdated,
} from '#store/reducers/categoriesSlice';
import {
  currenciesReceived,
  currencyAdded,
  currencyDeleted,
  currencyUpdated,
  defaultCurrencies,
  setMainCurrency,
  setDefaultCurrencies,
} from '#store/reducers/currenciesSlice';
import {
  templateAdded,
  templateDeleted,
  templatesReceived,
  templateUpdated,
} from '#store/reducers/templatesSlice';
import {
  transactionAdded,
  transactionDeleted,
  transactionsReceived,
  transactionUpdated,
} from '#store/reducers/transactionsSlice';
import {
  selectAccountById,
  selectAccountGroupById,
  selectCurrencyById,
  selectTransactionById,
  selectCategoryById,
  selectTemplateById,
} from '#store/selectors';
import { CreateAccountGroupData, UpdateAccountGroupData } from '#types/accountGroupType';
import { CreateAccountData, UpdateAccountData } from '#types/accountType';
import { Base } from '#types/baseType';
import { CreateCategoryData, UpdateCategoryData } from '#types/categoryType';
import { EncryptedData } from '#types/cipherType';
import { CommitActionDict } from '#types/commitType';
import { CreateCurrencyData, UpdateCurrencyData } from '#types/currencyType';
import { CreateTemplateData, UpdateTemplateData } from '#types/templateType';
import { CreateTransactionData, UpdateTransactionData } from '#types/transactionType';
import { dmodal } from '#ui/Modal';
import { getChanges } from '#utils/getChanges';
import { getSyncData } from '#utils/sync';

type CommitActionWithDispatch<
  T extends keyof CommitActionDict = keyof CommitActionDict,
  additionalProps = EmptyObject,
> = {
  dispatchAction?: () => void;
  action: { method: T; data: CommitActionDict[T] };
} & additionalProps;

export const actionCreator = {
  // === Currency ===
  setMainCurrency: (code: string): CommitActionWithDispatch<'set_main_currency'> => ({
    dispatchAction: () => store.dispatch(setMainCurrency(code)),
    action: { method: 'set_main_currency', data: { code } },
  }),
  createCurrency: (currency: CreateCurrencyData): CommitActionWithDispatch<'create_currency'> => ({
    dispatchAction: () => store.dispatch(currencyAdded(currency)),
    action: { method: 'create_currency', data: currency },
  }),
  updateCurrency: (
    code: string,
    currency: Except<UpdateCurrencyData, 'code'>,
  ): CommitActionWithDispatch<'update_currency'> | undefined => {
    const oldValue = selectCurrencyById(store.getState(), code);
    if (!oldValue) return;
    const changes = getChanges(oldValue, currency, { onlyKeys: Object.keys(currency) });
    if (changes.isEmpty) return;
    return {
      dispatchAction: () => store.dispatch(currencyUpdated({ id: code, changes: changes.value })),
      action: { method: 'update_currency', data: { code, ...changes.value } },
    };
  },
  deleteCurrency: (code: string): CommitActionWithDispatch<'delete_currency'> => ({
    dispatchAction: () => store.dispatch(currencyDeleted(code)),
    action: { method: 'delete_currency', data: { code } },
  }),

  // === Account Group ===
  createAccountGroup: (
    category: Except<CreateAccountGroupData, 'id'>,
  ): CommitActionWithDispatch<'create_account_group', { id: string }> => {
    const id = nanoid();
    return {
      dispatchAction: () => store.dispatch(accountGroupAdded({ id, ...category })),
      action: { method: 'create_account_group', data: { id, ...category } },
      id,
    };
  },
  updateAccountGroup: (
    id: string,
    category: Except<UpdateAccountGroupData, 'id'>,
  ): CommitActionWithDispatch<'update_account_group'> | undefined => {
    const oldValue = selectAccountGroupById(store.getState(), id);
    if (!oldValue) return;
    const changes = getChanges(oldValue, category, { onlyKeys: Object.keys(category) });
    if (changes.isEmpty) return;
    return {
      dispatchAction: () => store.dispatch(accountGroupUpdated({ id, changes: changes.value })),
      action: { method: 'update_account_group', data: { id, ...changes.value } },
    };
  },
  deleteAccountGroup: (id: string): CommitActionWithDispatch<'delete_account_group'> => ({
    dispatchAction: () => store.dispatch(accountGroupDeleted(id)),
    action: { method: 'delete_account_group', data: { id } },
  }),

  // === Account ===
  createAccount: (
    account: Except<CreateAccountData, 'id'>,
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
    account: Except<UpdateAccountData, 'id' | 'currencyCode'>,
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

  // === Category ===
  createCategory: (
    category: Except<CreateCategoryData, 'id'>,
  ): CommitActionWithDispatch<'create_category', { id: string }> => {
    const id = nanoid();
    return {
      dispatchAction: () => store.dispatch(categoryAdded({ id, ...category })),
      action: { method: 'create_category', data: { id, ...category } },
      id,
    };
  },
  updateCategory: (
    id: string,
    category: Except<UpdateCategoryData, 'id'>,
  ): CommitActionWithDispatch<'update_category'> | undefined => {
    const oldValue = selectCategoryById(store.getState(), id);
    if (!oldValue) return;
    const changes = getChanges(oldValue, category, { onlyKeys: Object.keys(category) });
    if (changes.isEmpty) return;
    return {
      dispatchAction: () => store.dispatch(categoryUpdated({ id, changes: changes.value })),
      action: { method: 'update_category', data: { id, ...changes.value } },
    };
  },
  deleteCategory: (id: string): CommitActionWithDispatch<'delete_category'> => ({
    dispatchAction: () => store.dispatch(categoryDeleted(id)),
    action: { method: 'delete_category', data: { id } },
  }),

  // === Template ===
  createTemplate: (
    template: Except<CreateTemplateData, 'id'>,
  ): CommitActionWithDispatch<'create_template', { id: string }> => {
    const id = nanoid();
    return {
      dispatchAction: () => store.dispatch(templateAdded({ id, ...template })),
      action: { method: 'create_template', data: { id, ...template } },
      id,
    };
  },
  updateTemplate: (
    id: string,
    template: Except<UpdateTemplateData, 'id'>,
  ): CommitActionWithDispatch<'update_template'> | undefined => {
    const oldValue = selectTemplateById(store.getState(), id);
    if (!oldValue) return;
    const changes = getChanges(oldValue, template, { onlyKeys: Object.keys(template) });
    if (changes.isEmpty) return;
    return {
      dispatchAction: () => store.dispatch(templateUpdated({ id, changes: changes.value })),
      action: { method: 'update_template', data: { id, ...changes.value } },
    };
  },
  deleteTemplate: (id: string): CommitActionWithDispatch<'delete_template'> => ({
    dispatchAction: () => store.dispatch(templateDeleted(id)),
    action: { method: 'delete_template', data: { id } },
  }),

  // === Transaction ===
  createTransaction: (
    transaction: Except<CreateTransactionData, 'id'>,
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
    transaction: Except<UpdateTransactionData, 'id'>,
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

  // === Base ===
  initBase: (): CommitActionWithDispatch<'init_base'> => ({
    dispatchAction: () => store.dispatch(setDefaultCurrencies()),
    action: {
      method: 'init_base',
      data: {
        currencies: defaultCurrencies,
        mainCurrencyCode: '',
        accountGroups: [],
        accounts: [],
        categories: [],
        templates: [],
        transactions: [],
      },
    },
  }),
  importBase: (base: Base): CommitActionWithDispatch<'import_base'> => ({
    dispatchAction: () => {
      store.dispatch(currenciesReceived(base.currencies));
      store.dispatch(setMainCurrency(base.mainCurrencyCode));
      store.dispatch(accountGroupsReceived(base.accountGroups));
      store.dispatch(accountsReceived(base.accounts));
      store.dispatch(categoriesReceived(base.categories));
      store.dispatch(templatesReceived(base.templates));
      store.dispatch(transactionsReceived(base.transactions));
    },
    action: { method: 'import_base', data: base },
  }),
  changePassword: (): CommitActionWithDispatch<'change_password'> => ({
    action: { method: 'change_password', data: getSyncData() },
  }),
};

class Committer {
  actions: CommitActionWithDispatch[];

  date: number;

  constructor(...actions: (CommitActionWithDispatch | undefined)[]) {
    this.actions = actions.filter((action): action is CommitActionWithDispatch => !!action);
    this.date = Date.now();
  }

  add(...actions: (CommitActionWithDispatch | undefined)[]) {
    this.actions.push(...actions.filter((action): action is CommitActionWithDispatch => !!action));
    this.date = Date.now();
    return this;
  }

  setDate(date: Date | string) {
    this.date = +dayjs(date);
    return this;
  }

  private async encrypt() {
    if (this.actions.length === 0) {
      throw new Error('Список действий пуст');
    }

    this.actions.forEach(({ dispatchAction }) => dispatchAction?.());

    const commitData = {
      actions: this.actions.map(({ action }) => action),
      createdAt: this.date,
      nonce: nanoid(),
    };

    return Cryptor.encrypt(commitData);
  }

  static async decrypt(encryptedData: EncryptedData) {
    const decryptedDataResult = await Cryptor.decrypt(encryptedData);
    if (decryptedDataResult.error) return;

    const decryptedData = decryptedDataResult.data;
    const transformedCommitParsingResult = commitSchema.safeParse(decryptedData);
    if (transformedCommitParsingResult.error) return;

    return new Committer(
      ...transformedCommitParsingResult.data.actions.map((action) => ({ action })),
    ).setDate(decryptedData.createdAt);
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
