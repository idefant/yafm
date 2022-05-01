export const getCurrencyValue = (value: number, decimalPlaces: number) => {
  return (value / 10 ** decimalPlaces)
    .toFixed(decimalPlaces || 0)
    .replace(/\.?0*$/, "");
};

export const displayToSysValue = (text: string, decimalPlaces: number) => {
  return Math.round(
    parseFloat(text.replace(",", ".")) * 10 ** decimalPlaces || 0
  );
};
