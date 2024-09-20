import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { ApiProps, ApiResult } from '#types/apiType';
import { paths } from '#types/exrates-api-schema';

type FetchCurrencies = paths['/currencies']['get'];
type FetchCurrenciesProps = ApiProps<FetchCurrencies>;
type FetchCurrenciesResult = ApiResult<FetchCurrencies>;

type FetchLastRates = paths['/last']['get'];
type FetchLastRatesProps = ApiProps<FetchLastRates>;
type FetchLastRatesResult = ApiResult<FetchLastRates>;

type FetchRatesByPeriod = paths['/period/simple/{period}']['get'];
type FetchRatesByPeriodProps = ApiProps<FetchRatesByPeriod>;
type FetchRatesByPeriodResult = ApiResult<FetchRatesByPeriod>;

export const exratesApi = createApi({
  reducerPath: 'api/exrates',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_EXRATES_API,
  }),
  endpoints: (builder) => ({
    fetchCurrencies: builder.query<FetchCurrenciesResult, FetchCurrenciesProps>({
      query: () => ({
        url: '/currencies',
        method: 'GET',
      }),
    }),
    fetchLastRates: builder.query<FetchLastRatesResult, FetchLastRatesProps>({
      query: (params) => ({
        url: '/last',
        params,
        method: 'GET',
      }),
    }),
    fetchRatesByPeriod: builder.query<FetchRatesByPeriodResult, FetchRatesByPeriodProps>({
      query: ({ period, ...params }) => ({
        url: `/period/simple/${period}`,
        params,
        method: 'GET',
      }),
    }),
  }),
});

export const { useFetchCurrenciesQuery, useFetchLastRatesQuery, useFetchRatesByPeriodQuery } =
  exratesApi;
