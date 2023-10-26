import { genId, genRanHex } from './random';

test('random hex', () => {
  expect(genRanHex(5).length).toBe(5);
});

test('random id', () => {
  expect(genId().length).toBe(8);
});
