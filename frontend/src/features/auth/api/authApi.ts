import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/shared/api/baseQuery';
import type { User } from '@/entities/user/types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  surname: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  endpoints: (build) => ({
    login: build.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({ url: '/api/auth/login', method: 'POST', body }),
    }),
    register: build.mutation<User, RegisterRequest>({
      query: (body) => ({ url: '/api/auth/register', method: 'POST', body }),
    }),
    me: build.query<User, void>({
      query: () => ({ url: '/api/auth/me' }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useMeQuery } = authApi;
