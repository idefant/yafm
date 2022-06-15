export const sum = <T>(arr: T[], callbackfn: (value: T) => number) =>
  arr.reduce((acc, value) => acc + callbackfn(value), 0);

export const groupSum = <T>(
  arr: T[],
  callbackfn: (value: T) => { key: string; num: number }
) => {
  return arr.reduce((acc: { [key: string]: number }, value: T) => {
    const { key, num } = callbackfn(value);
    acc[key] = (key in acc ? acc[key] : 0) + num;
    return acc;
  }, {});
};
