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

// тип ответа /api/auth/refresh
type RefreshResponse = { token: string };

function isRefreshResponse(d: unknown): d is RefreshResponse {
  return typeof d === 'object'
    && d !== null
    && 'token' in d
    && typeof (d as Record<string, unknown>).token === 'string';
}

export const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =
  async (args, api, extraOptions) => {
    let result = await rawBaseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
      const refresh = await rawBaseQuery(
        { url: '/api/auth/refresh', method: 'POST' },
        api,
        extraOptions
      );

      if (isRefreshResponse(refresh.data)) {
        const { token } = refresh.data;
        if (typeof window !== 'undefined') localStorage.setItem('token', token);
        // повтор исходного запроса уже с новым токеном
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        // опционально: зачистка токена/логаут
        if (typeof window !== 'undefined') localStorage.removeItem('token');
      }
    }

    return result;
  };

