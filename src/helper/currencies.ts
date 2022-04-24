import { TCurrency } from "../types/currencyType";

export const getCurrencyValue = (value: number, currency?: TCurrency) => {
  return (
    value / (currency ? 10 ** currency?.decimal_places_number : 1)
  ).toFixed(currency?.decimal_places_number || 0);
};

export const displayToSysValue = (text: string, currency: TCurrency) => {
  return Math.round(
    parseFloat(text) * 10 ** currency.decimal_places_number || 0
  );
};
