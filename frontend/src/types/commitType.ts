import { SetOptional } from 'type-fest';

import {
  CreateAccountGroupData,
  UpdateAccountGroupData,
  DeleteAccountGroupData,
} from './accountGroupType';
import { CreateAccountData, UpdateAccountData, DeleteAccountData } from './accountType';
import { Base } from './baseType';
import { CreateCategoryData, UpdateCategoryData, DeleteCategoryData } from './categoryType';
import {
  SetMainCurrencyData,
  CreateCurrencyData,
  UpdateCurrencyData,
  DeleteCurrencyData,
} from './currencyType';
import { CreateTemplateData, UpdateTemplateData, DeleteTemplateData } from './templateType';
import {
  CreateTransactionData,
  UpdateTransactionData,
  DeleteTransactionData,
} from './transactionType';

export type SetOptionalWithout<T, K extends keyof T> = SetOptional<T, Exclude<keyof T, K>>;

export type CommitActionDict = {
  // === Currency ===
  set_main_currency: SetMainCurrencyData;
  create_currency: CreateCurrencyData;
  update_currency: UpdateCurrencyData;
  delete_currency: DeleteCurrencyData;

  // === Account Group ===
  create_account_group: CreateAccountGroupData;
  update_account_group: UpdateAccountGroupData;
  delete_account_group: DeleteAccountGroupData;

  // === Account ===
  create_account: CreateAccountData;
  update_account: UpdateAccountData;
  delete_account: DeleteAccountData;

  // === Category ===
  create_category: CreateCategoryData;
  update_category: UpdateCategoryData;
  delete_category: DeleteCategoryData;

  // === Template ===
  create_template: CreateTemplateData;
  update_template: UpdateTemplateData;
  delete_template: DeleteTemplateData;

  // === Transaction ===
  create_transaction: CreateTransactionData;
  update_transaction: UpdateTransactionData;
  delete_transaction: DeleteTransactionData;

  // === Base ===
  init_base: Base;
  import_base: Base;
  change_password: Base;
};

export const updatedBaseMethods = ['init_base', 'import_base', 'change_password'] as const;

export type CommitAction = {
  [K in keyof CommitActionDict]: {
    method: K;
    data: CommitActionDict[K];
  };
}[keyof CommitActionDict];

export type Commit = {
  actions: CommitAction[];
  createdAt: Date;
};
