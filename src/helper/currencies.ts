import { selectCurrencyDict } from '../store/selectors';
import { store } from '../store/store';

export const numToString = (num: number, decimalPlaces: number, useGrouping = true) => (
  num.toLocaleString('en', { maximumFractionDigits: decimalPlaces, useGrouping })
);

export const getCurrencyValue = (value: number, decimalPlaces: number, useGrouping = true) => (
  numToString(value / 10 ** decimalPlaces, decimalPlaces, useGrouping)
);

export const displayToSysValue = (text: string, decimalPlaces: number) => Math.round(
  parseFloat(text.replace(',', '.')) * 10 ** decimalPlaces || 0,
);

export const checkDecimalPlaces = (value: string, decimalPlaces: number) => {
  const regex = new RegExp(`^\\d*.?\\d{0,${decimalPlaces}}$`);
  return regex.test(value);
};

export const convertPrice = (from: string, to: string, amount: number) => {
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

  const getNormalRate = (curCode: string) => prices[curCode]
    * 10 ** currencyDict[curCode.toUpperCase()].decimal_places_number;

  return (amount * getNormalRate(to)) / getNormalRate(from);
};
