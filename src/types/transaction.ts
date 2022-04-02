export type TTransaction = {
  id: string;
  name: string;
  description?: string;
  datetime: number;
  type: TTransactionType;
  income_account_id?: string;
  income_sum?: number;
  outcome_account_id?: string;
  outcome_sum?: number;
};

export type TTransactionType = "income" | "outcome" | "exchange";
