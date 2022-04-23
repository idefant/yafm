export type TTransaction = {
  id: string;
  name: string;
  description: string;
  datetime: number;
  type: TTransactionType;
  income?: TTransactionTransfer;
  outcome?: TTransactionTransfer;
  category_id?: string;
};

export type TTemplate = Omit<TTransaction, "datetime">;

export type TTransactionTransfer = {
  account_id: string;
  sum: number;
};

export type TTransactionType = "income" | "outcome" | "exchange";
