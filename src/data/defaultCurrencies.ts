import { TCurrency } from '#types/currencyType';

export const defaultCurrencies: TCurrency[] = [
  {
    code: 'RUB',
    name: 'Ruble',
    decimal_places_number: 2,
    type: 'fiat',
    color: '#b56d00',
  },
  {
    code: 'USD',
    name: 'US Dollar',
    decimal_places_number: 2,
    type: 'fiat',
    color: '#48a64c',
  },
  {
    code: 'EUR',
    name: 'Euro',
    decimal_places_number: 2,
    type: 'fiat',
    color: '#00349a',
  },

  {
    code: 'BTC',
    name: 'Bitcoin',
    decimal_places_number: 8,
    type: 'crypto',
    color: '#f7931a',
  },
];
