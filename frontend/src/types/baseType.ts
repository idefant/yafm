import { Account } from './accountType';
import { Category } from './categoryType';
import { Currency } from './currencyType';
import { Transaction, TransactionTemplate } from './transactionType';

export type Base = {
  accounts: Account[];
  transactions: Transaction[];
  templates: TransactionTemplate[];
  categories: {
    accounts: Category[];
    transactions: Category[];
  };
  currencies: Currency[];
  baseCurrencyCode: string;
};
