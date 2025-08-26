import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/shared/api/baseQuery';
import type { User } from '@/entities/user/types';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery,
  tagTypes: ['Users'],
  endpoints: (build) => ({
    getUsers: build.query<User[], void>({
      query: () => '/api/users',
      providesTags: ['Users'],
    }),
    getUser: build.query<User, number>({
      query: (id) => `/api/users/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Users', id }],
    }),
    createUser: build.mutation<User, Partial<User>>({
      query: (body) => ({ url: '/api/users', method: 'POST', body }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const { useGetUsersQuery, useGetUserQuery, useCreateUserMutation } = usersApi;
