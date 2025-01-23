import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';

// create a new mutex
const mutex = new Mutex();

const baseQuery = fetchBaseQuery({ baseUrl: '/api' });

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    // checking whether the mutex is locked
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await api.dispatch(
          baseQuery({ url: '/auth/refresh', method: 'POST' }, api, extraOptions),
        );

        if ('data' in refreshResult) {
          // retry the initial query
          result = await baseQuery(args, api, extraOptions);
        } else {
          // reload & logout
          window.location.reload();
        }
      } finally {
        // release must be called once the mutex should be released again.
        release();
      }
    } else {
      // wait until the mutex is available without locking it
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

export const mainApi = createApi({
  reducerPath: 'api/main',
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});
