import { TAccount } from './accountType';
import { TBase } from './baseType';
import { TCategory } from './categoryType';
import { TCurrency } from './currencyType';
import { TTransaction, TTransactionTemplate } from './transactionType';

export type CommitMethodDict = {
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
  set_base: TBase;
  import_base: TBase;
  change_password: TBase;
};
