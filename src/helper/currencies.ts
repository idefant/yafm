import { selectCurrencyDict } from '../store/selectors';
import { store } from '../store/store';

interface FormatPriceOptions {
  useGrouping?: boolean,
  useAtomicUnit?: boolean
}

export const formatPrice = (
  value: number,
  decimalPlaces: number,
  options?: FormatPriceOptions,
) => {
  const mergedOptions = { useGrouping: true, useAtomicUnit: true, ...options };
  const numDegree = mergedOptions.useAtomicUnit ? decimalPlaces : 0;
  const priceNum = value / 10 ** numDegree;
  return priceNum.toLocaleString(
    'en',
    {
      maximumFractionDigits: decimalPlaces,
      useGrouping: mergedOptions.useGrouping,
    },
  );
};

export const parseInputPrice = (text: string, decimalPlaces = 0) => (
  Math.round(parseFloat(text.replace(',', '.')) * 10 ** decimalPlaces)
);

export const checkValidPrice = (value: string, decimalPlaces: number) => {
  const regex = new RegExp(`^\\d+(\\.|,)?\\d{0,${decimalPlaces}}$`);
  return regex.test(value);
};

export const convertPrice = (
  from: string,
  to: string,
  amount: number,
  options?: { useAtomicUnit?: boolean },
) => {
  const mergedOptions = { useAtomicUnit: true, ...options };
  const state = store.getState();
  const { prices } = state.currency;
  const currencyDict = selectCurrencyDict(state);

  if (
    !prices
    || !(from in prices)
    || !(to in prices)
    || !(from.toUpperCase() in currencyDict)
    || !(to.toUpperCase() in currencyDict)
  ) {
    return 0;
  }

  const getDecimalPlaces = (curCode: string) => (
    currencyDict[curCode.toUpperCase()].decimal_places_number
  );

  const numberDegree = mergedOptions.useAtomicUnit
    ? getDecimalPlaces(to) - getDecimalPlaces(from)
    : 0;

  return (amount * prices[to] * 10 ** numberDegree) / prices[from];
};
