import axios from 'axios';

import { TRequest } from './requests';

const exrates = axios.create({ baseURL: process.env.REACT_APP_EXRATES_API });

export type TRates = Record<string, number>;
export type TDateRates = Record<string, TRates>;

export const getRatesBySimplePeriod = (date: string): TRequest<TDateRates> => (
  exrates.get(`/period/simple/${date}`)
);
