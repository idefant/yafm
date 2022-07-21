import { checkValidPrice, formatPrice, parseInputPrice } from './currencies';

test('format price', () => {
  expect(formatPrice(100, 2)).toBe('1');
  expect(formatPrice(100_000, 2)).toBe('1,000');
  expect(formatPrice(100_056, 2)).toBe('1,000.56');
  expect(formatPrice(100_070, 2)).toBe('1,000.7');
  expect(formatPrice(0, 5)).toBe('0');
});

test('parse input price', () => {
  expect(parseInputPrice('123', 2)).toBe(12300);
  expect(parseInputPrice('10', 3)).toBe(10000);
  expect(parseInputPrice('100.1', 2)).toBe(10010);
  expect(parseInputPrice('1.123', 2)).toBe(112);
  expect(parseInputPrice('1.125', 2)).toBe(113);
  expect(parseInputPrice('', 2)).toBe(NaN);
});

test('check valid price', () => {
  expect(checkValidPrice('12345', 3)).toBe(true);
  expect(checkValidPrice('0.01', 2)).toBe(true);
  expect(checkValidPrice('0.001', 2)).toBe(false);
  expect(checkValidPrice('0,01', 2)).toBe(true);
  expect(checkValidPrice('123.', 0)).toBe(true);
  expect(checkValidPrice('09', 2)).toBe(true);
  expect(checkValidPrice('abc', 8)).toBe(false);
  expect(checkValidPrice('5a.5', 8)).toBe(false);
  expect(checkValidPrice('5a', 8)).toBe(false);
});
