export const currencyTypes = ['fiat', 'crypto'] as const;

export type CurrencyType = (typeof currencyTypes)[number];

export type Currency = {
  code: string;
  name: string;
  decimal_places_number: number;
  type: CurrencyType;
  color: string;
  symbol: string;
};
