import { TAccount } from './accountType';
import { TCategory } from './categoryType';
import { TCipher } from './cipher';
import { TCurrency } from './currencyType';
import { TTimestamp } from './timestamp';
import { TTransaction, TTransactionTemplate } from './transactionType';

export type TBaseEncrypted = TCipher & TTimestamp & { id: string };

export type TBase = {
  accounts: TAccount[];
  transactions: TTransaction[];
  templates: TTransactionTemplate[];
  categories: {
    accounts: TCategory[];
    transactions: TCategory[];
  };
  currencies: TCurrency[];
  baseCurrencyCode: string;
};
