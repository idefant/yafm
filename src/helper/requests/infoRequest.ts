import axios, { AxiosPromise } from 'axios';

export const getInfoRequest = (baseURL: string): AxiosPromise<any> => axios({
  method: 'GET',
  baseURL,
  url: '/info',
  timeout: 3000,
});
