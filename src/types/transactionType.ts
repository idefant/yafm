export type TTransactionTransfer = {
  account_id: string;
  sum: number;
};

export type TTransactionType = 'income' | 'outcome' | 'exchange';
export const transactionTypes = ['income', 'outcome', 'exchange'];

export type TTransaction = {
  id: string;
  name?: string;
  description?: string;
  datetime: number;
  type: TTransactionType;
  income?: TTransactionTransfer;
  outcome?: TTransactionTransfer;
  category_id?: string;
};

export type TTemplate = Omit<TTransaction, 'datetime'>;

export const checkNeedIncome = (transactionType: TTransactionType) => ['income', 'exchange'].includes(transactionType);
export const checkNeedOutcome = (transactionType: TTransactionType) => ['outcome', 'exchange'].includes(transactionType);
