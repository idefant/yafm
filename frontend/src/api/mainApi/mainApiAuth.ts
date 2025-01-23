import { mainApi } from './mainApi';

type IsAuthResult = { isAuth: false } | { isAuth: true; isUser: boolean };

export const mainApiAuth = mainApi.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    isAuthorized: builder.query<IsAuthResult, unknown>({
      query: () => ({
        url: '/auth/isAuthorized',
      }),
    }),
    fetchProfileInfo: builder.query<Record<string, any>, unknown>({
      query: () => ({
        url: '/auth/profile',
      }),
    }),
  }),
});

export const { useIsAuthorizedQuery, useFetchProfileInfoQuery } = mainApiAuth;
