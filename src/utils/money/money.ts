import BigNumber from 'bignumber.js';

import { TRates } from '#types/exratesType';

class Money {
  value: BigNumber;

  currency?: string;

  private rates?: TRates;

  constructor(value: BigNumber | number | string, currency?: string, rates?: TRates) {
    this.value = BigNumber(value);
    this.currency = currency;
    this.rates = rates;
  }

  getAmount() {
    return this.value.toNumber();
  }

  to(currency: string, rates = this.rates) {
    if (!rates || !this.currency) {
      return money(0, currency);
    }

    if (rates[currency] && rates[this.currency]) {
      const rate = BigNumber(rates[currency]).div(rates[this.currency]);
      this.value = this.value.multipliedBy(rate);
    } else {
      this.value = BigNumber(0);
    }

    this.currency = currency;

    return this;
  }

  add(value: BigNumber | number | string, currency = this.currency, rates = this.rates) {
    if (currency === undefined || currency === this.currency) {
      this.value = this.value.plus(value);
      return this;
    }

    if (rates && this.currency) {
      const convertedValue = money(value, currency, rates).to(this.currency).value;
      this.value = this.value.plus(convertedValue);
    }

    return this;
  }

  subtract(value: BigNumber | number | string, currency = this.currency, rates = this.rates) {
    return this.add(-value, currency, rates);
  }

  static sum(
    items: { value: BigNumber | number | string; currency?: string; rates?: TRates }[],
    currency?: string,
    rates?: TRates,
  ) {
    return items.reduce(
      (acc, item) => acc.add(item.value, item.currency, item.rates),
      money(0, currency, rates),
    );
  }

  format() {
    return this.value.toFormat();
  }

  toString() {
    return this.value.toString();
  }
}

const money = Object.assign(
  (...params: ConstructorParameters<typeof Money>) => new Money(...params),
  {
    sum: Money.sum,
  },
);

export default money;
