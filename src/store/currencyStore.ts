import { makeAutoObservable } from "mobx";
import { RootStore } from ".";
import { defaultCurrencies } from "../data/defaultCurrencies";
import { TCurrency } from "../types/currencyType";

class CurrencyStore {
  rootStore: RootStore;
  currencies = defaultCurrencies;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
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
