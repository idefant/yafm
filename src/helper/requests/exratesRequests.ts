import axios from 'axios';

import { TRequest } from './requests';

const exrates = axios.create({ baseURL: 'http://10.0.0.1:3301' });

export type TRates = Record<string, number>;
export type TDateRates = Record<string, TRates>;

export const getRatesBySimplePeriod = (date: string): TRequest<TDateRates> => (
  exrates.get(`/period/simple/${date}`)
);
