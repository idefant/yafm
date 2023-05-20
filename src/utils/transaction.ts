import dayjs from 'dayjs';

import { store } from '../store';
import { selectAccountDict, selectCurrencyDict } from '../store/selectors';
import { TOperation, TTransaction, TTransactionType } from '../types/transactionType';

import { withDigits } from './currencies';
import { TDateRates } from './requests/exratesRequests';

export const getTransactionType = (operations: TOperation[]): TTransactionType => {
  if (operations.every((operation) => operation.sum > 0)) return 'income';
  if (operations.every((operation) => operation.sum < 0)) return 'outcome';
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

export const getTransactionsSum = (transactions: TTransaction[], rates?: TDateRates) => {
  const state = store.getState();
  const accountDict = selectAccountDict(state);
  const currencyDict = selectCurrencyDict(state);

  return transactions.reduce((acc, transaction) => {
    if (!rates) return 0;

    const dayRates = rates[dayjs(transaction.datetime).format('YYYY-MM-DD')];
    if (!dayRates) return 0;

    transaction.operations.forEach((operation) => {
      const account = accountDict[operation.account_id];
      const currency = currencyDict[account.currency_code];
      const sum = withDigits(operation.sum, currency.decimal_places_number);
      acc += (sum * dayRates.RUB) / dayRates[account.currency_code];
    });
    return acc;
  }, 0);
};
