export const getCurrencyValue = (
  value: number,
  decimalPlaces: number,
  useGrouping = true
) => {
  return numToString(value / 10 ** decimalPlaces, decimalPlaces, useGrouping);
};

export const numToString = (
  num: number,
  decimalPlaces: number,
  useGrouping = true
) =>
  num.toLocaleString("en", {
    maximumFractionDigits: decimalPlaces,
    useGrouping,
  });

export const displayToSysValue = (text: string, decimalPlaces: number) => {
  return Math.round(
    parseFloat(text.replace(",", ".")) * 10 ** decimalPlaces || 0
  );
};

export const checkDecimalPlaces = (value: string, decimalPlaces: number) => {
  const regex = new RegExp(`^\\d*.?\\d{0,${decimalPlaces}}$`);
  return regex.test(value);
};
