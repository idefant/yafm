import { TAccountCombined } from './accountType';
import { TCategory } from './categoryType';

export type TTransactionType = 'income' | 'outcome' | 'exchange';

export type TOperation = {
  account_id: string;
  sum: string;
};

export type TOperationCombined = TOperation & {
  account: TAccountCombined;
};

type TTransactionBase = {
  id: string;
  name?: string;
  description?: string;
  datetime: number;
  category_id?: string;
};

export type TTransaction = TTransactionBase & {
  operations: TOperation[];
};

export type TTransactionCombined = TTransactionBase & {
  operations: TOperationCombined[];
  category?: TCategory;
};

export type TTransactionTemplate = Omit<TTransaction, 'datetime'>;

export type TTransactionTemplateCombined = Omit<TTransactionCombined, 'datetime'>;
