export const currencyTypes = ['fiat', 'crypto'] as const;

export type TCurrencyType = (typeof currencyTypes)[number];

export type TCurrency = {
  code: string;
  name: string;
  decimal_places_number: number;
  type: TCurrencyType;
  color: string;
  symbol: string;
};
