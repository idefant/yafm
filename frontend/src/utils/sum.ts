import BigNumber from 'bignumber.js';

import { getProp } from './getProp';

/* eslint-disable no-unused-vars */
type Sum = {
  (arr: BigNumber[]): BigNumber;
  <T>(arr: T[], path: string): BigNumber;
  <T>(arr: T[], getValue: (value: T) => BigNumber): BigNumber;
};
/* eslint-enable no-unused-vars */

// eslint-disable-next-line no-unused-vars
export const sum: Sum = <T>(arr: T[], pathOrGetValue?: string | ((value: T) => BigNumber)) => {
  if (!arr.length) return BigNumber(0);

  if (!pathOrGetValue) {
    if (BigNumber.isBigNumber(arr[0])) {
      return arr.reduce((acc, item) => acc.plus(item as BigNumber), BigNumber(0));
    }

    return BigNumber(0);
  }

  if (typeof pathOrGetValue === 'string') {
    return arr.reduce((acc, item) => acc.plus(getProp(item, pathOrGetValue)), BigNumber(0));
  }

  return arr.reduce((acc, item) => acc.plus(pathOrGetValue(item)), BigNumber(0));
};
