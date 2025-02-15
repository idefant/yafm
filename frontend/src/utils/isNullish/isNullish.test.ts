import { isNullish } from './isNullish';

test('null', () => {
  expect(isNullish(null)).toBe(true);
});

test('undefined', () => {
  expect(isNullish(undefined)).toBe(true);
});

test('zero', () => {
  expect(isNullish(0)).toBe(false);
});

test('non-zero', () => {
  expect(isNullish(5)).toBe(false);
});

test('empty string', () => {
  expect(isNullish('')).toBe(false);
});

test('non-empty string', () => {
  expect(isNullish('lorem ipsum')).toBe(false);
});

test('empty object', () => {
  expect(isNullish({})).toBe(false);
});

test('empty array', () => {
  expect(isNullish([])).toBe(false);
});
