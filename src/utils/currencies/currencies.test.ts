import { parseInputPrice } from './currencies';

test('parse input price', () => {
  expect(parseInputPrice('123')).toBe(123);
  expect(parseInputPrice('10')).toBe(10);
  expect(parseInputPrice('100.1')).toBe(100.1);
  expect(parseInputPrice('1.123')).toBe(1.123);
  expect(parseInputPrice('1.125')).toBe(1.125);
  expect(parseInputPrice('')).toBe(NaN);
});
