import { groupSum, sumObjectsProp } from './arrays';

describe('sum', () => {
  test('sum in array', () => {
    expect(sumObjectsProp([12, 49, 35], (value) => value)).toBe(96);
  });

  test('sum of keys in array of objects', () => {
    expect(sumObjectsProp([{ num: 76 }, { num: 91 }, { num: 2 }], (value) => value.num)).toBe(169);
    expect(
      sumObjectsProp(
        [
          { num: 44, foo: 12 },
          { num: 15, bar: 'test' },
        ],
        (value) => value.num,
      ),
    ).toBe(59);
  });
});

test('group sums by key', () => {
  expect(
    groupSum(
      [
        { key: 'foo', num: 19 },
        { key: 'bar', num: 5 },
        { key: 'foo', num: 8 },
      ],
      (value) => ({ key: value.key, num: value.num }),
    ),
  ).toStrictEqual({ foo: 27, bar: 5 });
});
