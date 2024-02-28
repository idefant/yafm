import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { RootState } from '../store';
import { TCipher } from '../types/cipher';
import { TTimestamp } from '../types/timestamp';
import { TToken } from '../types/userType';

type LoginProps = {
  username: string;
  password: string;
};

type ResetPasswordProps = {
  username: string;
  password: string;
  new_password: string;
};

type FetchInfoResult = {
  username: string;
  sessions: { userAgent: string }[];
  bases: (TCipher & TTimestamp & { id: string })[];
};

export const userApi = createApi({
  reducerPath: 'api/main/user',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API,
    prepareHeaders: (headers, { getState, endpoint }) => {
      const token = (getState() as RootState).user.user?.access_token;
      if (token && ['fetchInfo', 'changePassword', 'deleteAccount'].includes(endpoint)) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<TToken, LoginProps>({
      query: (body) => ({
        url: '/login',
        method: 'POST',
        body,
      }),
    }),
    register: builder.mutation<TToken, LoginProps>({
      query: (body) => ({
        url: '/signup',
        method: 'POST',
        body,
      }),
    }),
    fetchInfo: builder.query<FetchInfoResult, void>({
      query: () => ({
        url: '/me',
      }),
    }),
    changePassword: builder.mutation<TToken, ResetPasswordProps>({
      query: (body) => ({
        url: '/change_password',
        method: 'PUT',
        body,
      }),
    }),
    deleteAccount: builder.mutation({
      query: () => ({
        url: '/me',
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useFetchInfoQuery,
  useChangePasswordMutation,
  useDeleteAccountMutation,
} = userApi;
