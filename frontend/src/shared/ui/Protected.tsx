'use client';
import { ReactNode, useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import { useRouter } from 'next/navigation';

interface Props {
  roles?: string[];
  children: ReactNode;
}

export default function Protected({ roles, children }: Props) {
  const user = useAppSelector((s) => s.auth.user);
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      router.replace('/login');
    } else if (roles && !roles.includes(user.role)) {
      router.replace('/dashboard');
    }
  }, [user, roles, router]);
  if (!user) return null;
  if (roles && !roles.includes(user.role)) return null;
  return <>{children}</>;
}
