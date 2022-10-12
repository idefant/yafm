/* eslint-disable no-unused-vars, no-param-reassign */
export const sumObjectsProp = <T>(arr: T[], callbackfn: (value: T) => number) => (
  arr.reduce((acc, value) => acc + callbackfn(value), 0)
);

type TGroupSumResult = { [key: string]: number };

export const groupSum = <T>(
  arr: T[],
  callbackfn: (value: T) => { key: string; num: number },
): TGroupSumResult => (
    arr.reduce((acc: TGroupSumResult, value: T) => {
      const { key, num } = callbackfn(value);
      acc[key] = (key in acc ? acc[key] : 0) + num;
      return acc;
    }, {})
  );
