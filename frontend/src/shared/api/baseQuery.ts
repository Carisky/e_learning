import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '@/shared/config/env';

export const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers) => {
    // пример: токен из localStorage (если нужен)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});
