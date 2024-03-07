import BigNumber from 'bignumber.js';

import { TOperation, TTransaction, TTransactionType } from '#types/transactionType';

export const getTransactionType = (operations: TOperation[]): TTransactionType => {
  if (operations.every((operation) => BigNumber(operation.sum).isPositive())) return 'income';
  if (operations.every((operation) => BigNumber(operation.sum).isNegative())) return 'outcome';
  return 'exchange';
};

export const getTransactionsGroupedByType = (transactions: TTransaction[]) => {
  const groupedTransactions: Record<TTransactionType, TTransaction[]> = {
    income: [],
    outcome: [],
    exchange: [],
  };

  transactions.forEach((transaction) => {
    const transactionType = getTransactionType(transaction.operations);
    groupedTransactions[transactionType].push(transaction);
  });

  return groupedTransactions;
};
