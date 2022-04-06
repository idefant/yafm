export type TCurrency = {
  code: string;
  symbol?: string;
  name: string;
  decimal_places_number: number;
  type: TCurrencyType;
};

export type TCurrencyType = "fiat" | "crypto";
