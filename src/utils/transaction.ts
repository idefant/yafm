import BigNumber from 'bignumber.js';

import { Operation, Transaction, TransactionType } from '#types/transactionType';

export const getTransactionType = (operations: Operation[]): TransactionType => {
  if (operations.every((operation) => BigNumber(operation.sum).isPositive())) return 'income';
  if (operations.every((operation) => BigNumber(operation.sum).isNegative())) return 'outcome';
  return 'exchange';
};

export const getTransactionsGroupedByType = <T extends Transaction>(transactions: T[]) => {
  const groupedTransactions: Record<TransactionType, T[]> = {
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
