import { configureStore } from '@reduxjs/toolkit';
import { usersApi } from '@/features/users/api/usersApi';
import usersReducer from '@/features/users/model/usersSlice';

export const makeStore = () =>
  configureStore({
    reducer: {
      users: usersReducer,
      [usersApi.reducerPath]: usersApi.reducer,
    },
    middleware: (gDM) => gDM().concat(usersApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
