import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { TBaseEncrypted } from '#types/baseType';
import { TCipher } from '#types/cipher';
import { getUser } from '#utils/auth';

export const baseApi = createApi({
  reducerPath: 'api/main/base',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API,
    prepareHeaders: (headers) => {
      const token = getUser()?.access_token;
      headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createBase: builder.mutation<TBaseEncrypted, TCipher>({
      query: (body) => ({
        url: '/base/',
        method: 'POST',
        body,
      }),
    }),
    fetchBaseList: builder.query<TBaseEncrypted[], void>({
      query: () => ({
        url: '/base/',
      }),
    }),
    fetchLatestBase: builder.query<TBaseEncrypted[], void>({
      query: () => ({
        url: '/base/latest',
      }),
    }),
  }),
});

export const { useCreateBaseMutation, useFetchBaseListQuery, useFetchLatestBaseQuery } = baseApi;
