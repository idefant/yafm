import axios from "axios";
import { defaultCurrencies } from "../../data/defaultCurrencies";

export const getPricesRequest = () => {
  return axios({
    method: "GET",
    baseURL: "https://api.coingecko.com/api/v3/simple/price",
    params: {
      ids: "bitcoin",
      vs_currencies: defaultCurrencies
        .map((currency) => currency.code)
        .join(","),
    },
  });
};

export const getFnGIndexRequest = () => {
  return axios({
    method: "GET",
    baseURL: "https://api.alternative.me/fng/",
    params: { limit: 1 },
  });
};
