import { configureStore } from '@reduxjs/toolkit';
import { usersApi } from '@/features/users/api/usersApi';
import usersReducer from '@/features/users/model/usersSlice';
import { authApi } from '@/features/auth/api/authApi';
import authReducer from '@/features/auth/model/authSlice';

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      users: usersReducer,
      [usersApi.reducerPath]: usersApi.reducer,
      [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (gDM) => gDM().concat(usersApi.middleware, authApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
