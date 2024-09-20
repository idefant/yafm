import { SetOptional } from 'type-fest';

import { TAccount } from './accountType';
import { TBase } from './baseType';
import { TCategory } from './categoryType';
import { TCurrency } from './currencyType';
import { TTransaction, TTransactionTemplate } from './transactionType';

type IsUndefined<T> = undefined extends T ? true : false;

type IfUndefined<T, TypeIfUndefined = true, TypeIfNotUndefined = false> =
  IsUndefined<T> extends true ? TypeIfUndefined : TypeIfNotUndefined;

type SetNullableIfUndefined<T> = IfUndefined<T, T | null, T>;

type OptionalToNull<T> = {
  [K in keyof T]: SetNullableIfUndefined<T[K]>;
};
type SetOptionalWithout<T, K extends keyof T> = SetOptional<T, Exclude<keyof T, K>>;

type SetUpdatable<T, K extends keyof T = never> = SetOptionalWithout<OptionalToNull<T>, K>;

export type CommitActionDict = {
  // currency
  set_basic_currency: {
    code: string;
  };
  create_currency: TCurrency;
  update_currency: SetUpdatable<TCurrency, 'code'>;
  delete_currency: {
    code: string;
  };

  // account category
  create_account_category: TCategory;
  update_account_category: SetUpdatable<TCategory, 'id'>;
  delete_account_category: {
    id: string;
  };

  // account
  create_account: TAccount;
  update_account: SetUpdatable<TAccount, 'id'>;
  delete_account: {
    id: string;
  };

  // transaction category
  create_transaction_category: TCategory;
  update_transaction_category: SetUpdatable<TCategory, 'id'>;
  delete_transaction_category: {
    id: string;
  };

  // transaction template
  create_transaction_template: TTransactionTemplate;
  update_transaction_template: SetUpdatable<TTransactionTemplate, 'id'>;
  delete_transaction_template: {
    id: string;
  };

  // transaction
  create_transaction: TTransaction;
  update_transaction: SetUpdatable<TTransaction, 'id'>;
  delete_transaction: {
    id: string;
  };

  // base
  init_base: TBase;
  import_base: TBase;
  change_password: TBase;
};

export const updatedBaseMethods = ['init_base', 'import_base', 'change_password'] as const;

export type Transform = 'gzip';

export type CommitAction = {
  [K in keyof CommitActionDict]: {
    method: K;
    data: CommitActionDict[K];
  };
}[keyof CommitActionDict];

export type CommitActionWithTransforms = CommitAction & { transforms?: Transform[]; data: any };

export type Commit = {
  actions: CommitAction[];
  createdAt: Date;
};

export type CommitWithTransforms = {
  actions: CommitActionWithTransforms[];
  createdAt: Date;
};
