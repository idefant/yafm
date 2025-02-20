import BigNumber from 'bignumber.js';

import { OperationExtended, TransactionExtended, TransactionType } from '#types/transactionType';

import { groupBy } from './groupBy';

/**
 * Определяет тип транзакции по списку операций.
 *
 * @param operations Список операций
 * @return
 * - `income` - есть хотя бы одна валюта с положительной суммой, при нет ни одной валюты с отрицательной суммой
 * - `outcome` - есть хотя бы одна валюта с отрицательной суммой, при нет ни одной валюты с положительной суммой суммой
 * - `exchange` - все остальные случаи
 */
export const getTransactionType = (operations: OperationExtended[]): TransactionType => {
  const currencies = Object.entries(
    groupBy(operations, (operation) => operation.account.currencyCode),
  ).map(([currencyCode, operations]) => {
    const sum = BigNumber.sum(...operations.map((operation) => operation.sum));

    return {
      currencyCode,
      operations,
      sum,
    };
  });

  if (
    currencies.every((currency) => currency.sum.gte(0)) &&
    currencies.some((currency) => currency.sum.gt(0))
  ) {
    return 'income';
  }
  if (
    currencies.every((currency) => currency.sum.lte(0)) &&
    currencies.some((currency) => currency.sum.lt(0))
  ) {
    return 'outcome';
  }
  return 'exchange';
};

export const getTransactionsGroupedByType = <T extends TransactionExtended>(transactions: T[]) => {
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
