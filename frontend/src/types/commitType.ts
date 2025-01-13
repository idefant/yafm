import { SetOptional } from 'type-fest';

import { Account } from './accountType';
import { Base } from './baseType';
import { Category } from './categoryType';
import { Currency } from './currencyType';
import { Transaction, TransactionTemplate } from './transactionType';

type IsUndefined<T> = undefined extends T ? true : false;

type IfUndefined<T, TypeIfUndefined = true, TypeIfNotUndefined = false> =
  IsUndefined<T> extends true ? TypeIfUndefined : TypeIfNotUndefined;

type SetNullableIfUndefined<T> = IfUndefined<T, T | null, T>;

type OptionalToNull<T> = {
  [K in keyof T]: SetNullableIfUndefined<T[K]>;
};
export type SetOptionalWithout<T, K extends keyof T> = SetOptional<T, Exclude<keyof T, K>>;

type SetUpdatable<T, K extends keyof T = never> = SetOptionalWithout<OptionalToNull<T>, K>;

export type CommitActionDict = {
  // currency
  set_basic_currency: {
    code: string;
  };
  create_currency: Currency;
  update_currency: SetUpdatable<Currency, 'code'>;
  delete_currency: {
    code: string;
  };

  // account category
  create_account_category: Category;
  update_account_category: SetUpdatable<Category, 'id'>;
  delete_account_category: {
    id: string;
  };

  // account
  create_account: Account;
  update_account: SetUpdatable<Account, 'id'>;
  delete_account: {
    id: string;
  };

  // transaction category
  create_transaction_category: Category;
  update_transaction_category: SetUpdatable<Category, 'id'>;
  delete_transaction_category: {
    id: string;
  };

  // transaction template
  create_transaction_template: TransactionTemplate;
  update_transaction_template: SetUpdatable<TransactionTemplate, 'id'>;
  delete_transaction_template: {
    id: string;
  };

  // transaction
  create_transaction: Transaction;
  update_transaction: SetUpdatable<Transaction, 'id'>;
  delete_transaction: {
    id: string;
  };

  // base
  init_base: Base;
  import_base: Base;
  change_password: Base;
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
