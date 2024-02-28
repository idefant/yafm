import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { TDateRates, TRates } from '../types/exratesType';

export const exratesApi = createApi({
  reducerPath: 'api/main/exrates',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_EXRATES_API,
  }),
  endpoints: (builder) => ({
    fetchLastRates: builder.query<{ date: string; rates: TRates }, void>({
      query: () => ({
        url: '/last',
        method: 'GET',
      }),
    }),
    fetchRatesByPeriod: builder.query<TDateRates, string>({
      query: (date) => ({
        url: `/period/simple/${date}`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useFetchRatesByPeriodQuery, useFetchLastRatesQuery } = exratesApi;
