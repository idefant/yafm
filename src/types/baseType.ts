import { TAccount } from './accountType';
import { TCategory } from './categoryType';
import { TCurrency } from './currencyType';
import { TTransaction, TTransactionTemplate } from './transactionType';

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
