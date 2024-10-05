import { AccountCombined } from './accountType';
import { Category } from './categoryType';

export type TransactionType = 'income' | 'outcome' | 'exchange';

export type Operation = {
  account_id: string;
  sum: string;
};

export type OperationCombined = Operation & {
  account: AccountCombined;
};

type TransactionBase = {
  id: string;
  name?: string;
  description?: string;
  datetime: number;
  category_id?: string;
};

export type Transaction = TransactionBase & {
  operations: Operation[];
};

export type TransactionCombined = TransactionBase & {
  operations: OperationCombined[];
  category?: Category;
};

export type TransactionTemplate = Omit<Transaction, 'datetime'>;

export type TransactionTemplateCombined = Omit<TransactionCombined, 'datetime'>;
