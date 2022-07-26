import { TAccount } from './accountType';
import { TCurrency } from './currencyType';

export type TOperation = {
  account_id: string;
  sum: number;
};

export type TOperationExtended = TOperation & {
  account: TAccount;
  currency: TCurrency;
};

export type TTransaction = {
  id: string;
  name?: string;
  description?: string;
  datetime: number;
  category_id?: string;
  operations: TOperation[];
};

export type TTemplate = Omit<TTransaction, 'datetime'>;
