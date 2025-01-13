import { compareObjByStr } from './string';

test('compare objects by string', () => {
  expect(compareObjByStr({ foo: 'abc' }, { foo: 'abc' }, (value) => value.foo)).toBe(0);
  expect(compareObjByStr({ foo: 'abc' }, { foo: 'abcz' }, (value) => value.foo)).toBe(-1);
  expect(compareObjByStr({ foo: 'abc' }, { foo: 'a' }, (value) => value.foo)).toBe(1);
});
