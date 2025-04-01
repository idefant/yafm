import { Dictionary } from '@reduxjs/toolkit';

export const getEntities = <T, K extends string | number, TStrict extends boolean = false>(
  /* eslint-disable no-unused-vars */
  arr: T[],
  getGroupName: (value: T) => K,
  options?: { strict?: TStrict },
  /* eslint-enable no-unused-vars */
): TStrict extends true ? Record<string, T> : Dictionary<T> =>
  Object.fromEntries(arr.map((item) => [getGroupName(item), item]));
