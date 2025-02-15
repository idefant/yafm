import { getChanges } from './getChanges';

test('Empty objects', () => {
  expect(getChanges({}, {})).toEqual({ isEmpty: true });
});

test('Add prop', () => {
  expect(getChanges({}, { foo: 'bar' })).toEqual({
    isEmpty: false,
    value: { foo: 'bar' },
  });
});

test('Add prop with undefined value', () => {
  expect(getChanges({}, { foo: undefined })).toEqual({ isEmpty: true });
});

test('Add prop with null value', () => {
  expect(getChanges({}, { foo: null })).toEqual({ isEmpty: true });
});

test('Remove prop', () => {
  expect(getChanges({ foo: 'bar' }, {})).toEqual({
    isEmpty: false,
    value: { foo: null },
  });
});

test('Remove prop with undefined value', () => {
  expect(getChanges({ foo: undefined }, {})).toEqual({ isEmpty: true });
});

test('Remove prop with null value', () => {
  expect(getChanges({ foo: null }, {})).toEqual({ isEmpty: true });
});

test('Replace value', () => {
  expect(getChanges({ foo: 'bar' }, { foo: 'baz' })).toEqual({
    isEmpty: false,
    value: { foo: 'baz' },
  });
});

test('Replace value with undefined', () => {
  expect(getChanges({ foo: 'bar' }, { foo: undefined })).toEqual({
    isEmpty: false,
    value: { foo: null },
  });
});

test('Replace value with null', () => {
  expect(getChanges({ foo: 'bar' }, { foo: null })).toEqual({
    isEmpty: false,
    value: { foo: null },
  });
});

test('Replace undefined value with null', () => {
  expect(getChanges({ foo: undefined }, { foo: null })).toEqual({ isEmpty: true });
});

test('Replace null value with undefined', () => {
  expect(getChanges({ foo: null }, { foo: undefined })).toEqual({ isEmpty: true });
});

test('Replace prop', () => {
  expect(getChanges({ foo: 'bar' }, { baz: 'bat' })).toEqual({
    isEmpty: false,
    value: { foo: null, baz: 'bat' },
  });
});

test('Rename key', () => {
  expect(getChanges({ foo: 'bar' }, { baz: 'bar' })).toEqual({
    isEmpty: false,
    value: { foo: null, baz: 'bar' },
  });
});

test('Nested without changes', () => {
  expect(getChanges({ foo: { bar: 'baz' } }, { foo: { bar: 'baz' } })).toEqual({ isEmpty: true });
});

test('Nested with change nested object value', () => {
  expect(getChanges({ foo: { bar: 'baz' } }, { foo: { bar: 'bat' } })).toEqual({
    isEmpty: false,
    value: { foo: { bar: 'bat' } },
  });
});

test('Nested with change nested object', () => {
  expect(getChanges({ foo: { bar: 'baz' } }, { foo: { quux: 'bat' } })).toEqual({
    isEmpty: false,
    value: { foo: { quux: 'bat' } },
  });
});

test('Replace nested object', () => {
  expect(getChanges({ foo: { bar: 'baz' } }, { quux: { bar: 'baz' } })).toEqual({
    isEmpty: false,
    value: { foo: null, quux: { bar: 'baz' } },
  });
});
