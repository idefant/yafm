import { store } from '../../store';
import { selectCurrencyDict } from '../../store/selectors';
import { TRates } from '../../types/exratesType';

interface FormatPriceOptions {
  useGrouping?: boolean;
  useAtomicUnit?: boolean;
}

export const withDigits = (sum: number, digits: number) => sum * 10 ** -digits;
export const withoutDigits = (sum: number, digits: number) => Math.round(sum * 10 ** digits);

export const formatPrice = (value: number, digits: number, options?: FormatPriceOptions) => {
  const mergedOptions = { useGrouping: true, useAtomicUnit: true, ...options };
  const numDegree = mergedOptions.useAtomicUnit ? digits : 0;
  const priceNum = withDigits(value, numDegree);
  return priceNum.toLocaleString('en', {
    maximumFractionDigits: digits,
    useGrouping: mergedOptions.useGrouping,
  });
};

export const parseInputPrice = (text: string, digits = 0) =>
  Math.round(withoutDigits(parseFloat(text.replace(',', '.')), digits));

export const checkValidPrice = (value: string, digits: number) => {
  const regex = new RegExp(`^\\d+(\\.|,)?\\d{0,${digits}}$`);
  return regex.test(value);
};

export const convertPrice = (
  from: string,
  to: string,
  amount: number,
  prices: TRates,
  options?: { useAtomicUnit?: boolean },
) => {
  const mergedOptions = { useAtomicUnit: true, ...options };
  const state = store.getState();
  const currencyDict = selectCurrencyDict(state);

  if (
    !prices ||
    !(from in prices) ||
    !(to in prices) ||
    !(from.toUpperCase() in currencyDict) ||
    !(to.toUpperCase() in currencyDict)
  ) {
    return 0;
  }

  const getDecimalPlaces = (curCode: string) =>
    currencyDict[curCode.toUpperCase()].decimal_places_number;

  const numberDegree = mergedOptions.useAtomicUnit
    ? getDecimalPlaces(to) - getDecimalPlaces(from)
    : 0;

  return (withoutDigits(amount, numberDegree) * prices[to]) / prices[from];
};

export const getHistoryBalancesByChanges = (
  startSum: Record<string, number>,
  changes: Record<string, number>[],
) => {
  const currentSum = { ...startSum };

  return changes.map((change) => {
    Object.entries(change).forEach(([code, sum]) => {
      currentSum[code] += sum;
    });
    return { ...currentSum };
  });
};
