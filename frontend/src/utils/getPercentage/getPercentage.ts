import BigNumber from 'bignumber.js';

export const getPercentage = (
  partValue: BigNumber | number | string,
  totalValue: BigNumber | number | string,
  options?: { decimalPlaces?: number },
) => {
  const decimalPlaces = options?.decimalPlaces || 2;
  const percentage = BigNumber(partValue).div(totalValue).multipliedBy(100).toFixed(decimalPlaces);
  return `${percentage}%`;
};
