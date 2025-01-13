import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { ApiProps, ApiResult } from '#types/apiType';
import { paths } from '#types/main-api-schema';
import { getUser } from '#utils/auth';

type FetchCommits = paths['/commit/actual']['get'];
type FetchCommitsProps = ApiProps<FetchCommits>;
type FetchCommitsResult = ApiResult<FetchCommits>;

type CreateCommit = paths['/commit']['post'];
type CreateCommitProps = ApiProps<CreateCommit>;
type CreateCommitResult = ApiResult<CreateCommit>;

export const mainApi = createApi({
  reducerPath: 'api/main',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers) => {
      const token = getUser()?.access_token;
      headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchCommits: builder.query<FetchCommitsResult, FetchCommitsProps>({
      query: (params) => ({
        url: '/commit/actual',
        params,
      }),
    }),
    createCommit: builder.mutation<CreateCommitResult, CreateCommitProps>({
      query: (body) => ({
        url: '/commit',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useFetchCommitsQuery, useCreateCommitMutation } = mainApi;
