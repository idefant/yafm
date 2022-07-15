import axios, { AxiosPromise } from "axios";

export const getInfoRequest = (baseURL: string): AxiosPromise<any> => {
  return axios({
    method: "GET",
    baseURL,
    url: "/info",
    timeout: 3000,
  });
};
