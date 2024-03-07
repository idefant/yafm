import money from './money';

const rates = { USD: 1, RUB: 90 };

test('Simple', () => {
  expect(money(123, 'USD').getAmount()).toBe(123);
});

test('To', () => {
  expect(money(3, 'USD', rates).to('RUB').getAmount()).toBe(270);
  expect(money(3, 'USD').to('RUB', rates).getAmount()).toBe(270);
});

test('Add', () => {
  expect(money(1, 'USD').add(2).getAmount()).toBe(3);
  expect(money(1, 'USD', rates).add(90, 'RUB').getAmount()).toBe(2);
  expect(money(1, 'USD', rates).add(90, 'RUB').add(1).getAmount()).toBe(3);
  expect(money(1, 'USD').add(90, 'RUB', rates).getAmount()).toBe(2);
});

test('Subtract', () => {
  expect(money(3, 'USD').subtract(2).getAmount()).toBe(1);
  expect(money(1, 'USD').subtract(2).getAmount()).toBe(-1);
  expect(money(2, 'USD', rates).subtract(90, 'RUB').getAmount()).toBe(1);
  expect(money(5, 'USD', rates).subtract(90, 'RUB').subtract(1).getAmount()).toBe(3);
  expect(money(3, 'USD').subtract(90, 'RUB', rates).getAmount()).toBe(2);
});

test('Sum', () => {
  expect(money.sum([{ value: 1 }, { value: 2 }, { value: 3 }], 'RUB').getAmount()).toBe(6);
  expect(
    money
      .sum([{ value: 1 }, { value: 2, currency: 'USD' }, { value: 3 }], 'RUB', rates)
      .getAmount(),
  ).toBe(184);
  expect(
    money
      .sum([{ value: 1 }, { value: 2, currency: 'USD', rates }, { value: 3 }], 'RUB')
      .getAmount(),
  ).toBe(184);
});

test('Format', () => {
  expect(money(123, 'USD').format()).toBe('123');
  expect(money(123.456, 'USD').format()).toBe('123.456');
  expect(money(123456, 'USD').format()).toBe('123,456');
  expect(money(-123, 'USD').format()).toBe('-123');
});
