import { makeAutoObservable } from "mobx";
import { RootStore } from ".";
import { defaultCurrencies } from "../data/defaultCurrencies";
import { TCurrency } from "../types/currencyType";

class CurrencyStore {
  rootStore: RootStore;
  currencies = defaultCurrencies;
  prices: { [code: string]: number } | undefined;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  setPrices(prices: { [code: string]: number }) {
    this.prices = prices;
  }

  convertPrice(from: string, to: string, amount: number) {
    if (
      !this.prices ||
      !(from in this.prices) ||
      !(to in this.prices) ||
      !(from.toUpperCase() in this.currencyDict) ||
      !(to.toUpperCase() in this.currencyDict)
    )
      return 0;

    const getNormalRate = (
      prices: { [code: string]: number },
      curCode: string
    ) =>
      prices[curCode] *
      10 ** this.currencyDict[curCode.toUpperCase()].decimal_places_number;

    return (
      (amount * getNormalRate(this.prices, to)) /
      getNormalRate(this.prices, from)
    );
  }

  get currencyDict() {
    const dict: { [code: string]: TCurrency } = {};
    this.currencies.forEach((currency) => {
      dict[currency.code] = currency;
    });
    return dict;
  }
}

export default CurrencyStore;
