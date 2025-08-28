import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { API_URL } from '@/shared/config/env';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refresh = await rawBaseQuery(
      { url: '/api/auth/refresh', method: 'POST' },
      api,
      extraOptions,
    );

    const token = (refresh.data as any)?.token as string | undefined;
    if (token) {
      localStorage.setItem('token', token);
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }

  return result;
};
