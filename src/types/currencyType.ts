export type TCurrency = {
  code: string;
  name: string;
  decimal_places_number: number;
  type: TCurrencyType;
};

export type TCurrencyType = "fiat" | "crypto";
