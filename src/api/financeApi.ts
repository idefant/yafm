import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type FetchFnGIndexResult = {
  name: string;
  data: {
    value: string;
    value_classification: string;
    timestamp: string;
    time_until_update: string;
  }[];
};

export const financeApi = createApi({
  reducerPath: 'api/main/finance',
  baseQuery: fetchBaseQuery(),
  endpoints: (builder) => ({
    fetchFnGIndex: builder.query<any, void>({
      query: () => ({
        url: 'https://api.alternative.me/fng/',
        method: 'GET',
      }),
      transformResponse: (response: FetchFnGIndexResult) => {
        const data = response.data[0];
        return {
          value: data.value,
          text: data.value_classification,
        };
      },
    }),
  }),
});

export const { useFetchFnGIndexQuery } = financeApi;
