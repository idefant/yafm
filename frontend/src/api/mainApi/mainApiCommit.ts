import { ApiProps, ApiResult } from '#types/apiType';
import { paths } from '#types/main-api-schema';

import { mainApi } from './mainApi';

type FetchCommits = paths['/commit/actual']['get'];
type FetchCommitsProps = ApiProps<FetchCommits>;
type FetchCommitsResult = ApiResult<FetchCommits>;

type CreateCommit = paths['/commit']['post'];
type CreateCommitProps = ApiProps<CreateCommit>;
type CreateCommitResult = ApiResult<CreateCommit>;

export const mainApiCommit = mainApi.injectEndpoints({
  overrideExisting: false,
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

export const { useFetchCommitsQuery, useCreateCommitMutation } = mainApiCommit;
