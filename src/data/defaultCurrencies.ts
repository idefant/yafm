import { TCurrency } from "../types/currencyType";

export const defaultCurrencies: TCurrency[] = [
  {
    code: "RUB",
    name: "Ruble",
    symbol: "₽",
    decimal_places_number: 2,
    type: "fiat",
  },
  {
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    decimal_places_number: 2,
    type: "fiat",
  },
  {
    code: "EUR",
    name: "Euro",
    symbol: "€",
    decimal_places_number: 2,
    type: "fiat",
  },
  {
    code: "CNY",
    name: "Yuan Renminbi",
    symbol: "¥",
    decimal_places_number: 2,
    type: "fiat",
  },

  {
    code: "BTC",
    name: "Bitcoin",
    symbol: "₿",
    decimal_places_number: 8,
    type: "crypto",
  },
  {
    code: "ETH",
    name: "Ethereum",
    symbol: "Ξ",
    decimal_places_number: 18,
    type: "crypto",
  },
  {
    code: "ADA",
    name: "Cardano",
    decimal_places_number: 6,
    type: "crypto",
  },
  {
    code: "BNB",
    name: "BNB",
    decimal_places_number: 8,
    type: "crypto",
  },
  {
    code: "XMR",
    name: "Monero",
    decimal_places_number: 12,
    type: "crypto",
  },
];
