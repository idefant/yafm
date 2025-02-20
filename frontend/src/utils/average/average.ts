import BigNumber from 'bignumber.js';

export const average = (...items: BigNumber.Value[]) => {
  if (items.length === 0) return BigNumber(0);
  return BigNumber.sum(...items).div(items.length);
};
