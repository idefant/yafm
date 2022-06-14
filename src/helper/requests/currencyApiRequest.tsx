import axios from "axios";
import { defaultCurrencies } from "../../data/defaultCurrencies";

const apiServerUrl = "https://api.coingecko.com/api/v3/";

export const getPricesRequest = () => {
  return axios({
    method: "GET",
    baseURL: apiServerUrl,
    url: "/simple/price",
    params: {
      ids: "bitcoin",
      vs_currencies: defaultCurrencies
        .map((currency) => currency.code)
        .join(","),
    },
  });
};
