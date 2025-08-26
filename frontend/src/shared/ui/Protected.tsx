'use client';
import { ReactNode, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import { authApi } from '@/features/auth/api/authApi';
import { setCredentials, setUser } from '@/features/auth/model/authSlice';

interface Props {
  roles?: string[];
  children: ReactNode;
}

export default function Protected({ roles, children }: Props) {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.replace('/login');
      return;
    }
    if (!user) {
      dispatch(setCredentials({ token }));
      dispatch(authApi.endpoints.me.initiate())
        .unwrap()
        .then((u) => {
          dispatch(setUser(u));
          if (roles && !roles.includes(u.role)) router.replace('/dashboard');
        })
        .catch(() => router.replace('/login'));
      return;
    }
    if (roles && !roles.includes(user.role)) {
      router.replace('/dashboard');
    }
  }, [user, roles, router, dispatch]);
  if (!user) return null;
  if (roles && !roles.includes(user.role)) return null;
  return <>{children}</>;
}
