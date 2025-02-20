// eslint-disable-next-line no-unused-vars
type GetValue<T> = (index: number) => T;

export const createArray = <T = undefined>(count: number, value?: T | GetValue<T>): T[] =>
  [...new Array(count)].map((_, i) => {
    if (typeof value === 'function') {
      return (value as GetValue<T>)(i);
    }

    return value as T;
  });
