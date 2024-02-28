import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { RootState } from '../store';
import { TCipher } from '../types/cipher';
import { TTimestamp } from '../types/timestamp';

export const baseApi = createApi({
  reducerPath: 'api/main/base',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API,
    prepareHeaders: (headers, { getState, endpoint }) => {
      const token = (getState() as RootState).user.user?.access_token;
      if (token && ['createBase'].includes(endpoint)) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createBase: builder.mutation<TCipher & TTimestamp & { id: string }, TCipher>({
      query: (body) => ({
        url: '/base/',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useCreateBaseMutation } = baseApi;
