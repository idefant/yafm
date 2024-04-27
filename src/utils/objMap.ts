import { Dictionary } from '@reduxjs/toolkit';

export const objMap = <T, S>(
  /* eslint-disable no-unused-vars */
  obj: Record<string, T>,
  callback: (key: string, value: T) => [string, S],
  /* eslint-enable no-unused-vars */
): Dictionary<S> =>
  Object.fromEntries(Object.entries(obj).map(([key, value]) => callback(key, value)));
