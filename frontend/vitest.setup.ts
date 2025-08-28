import '@testing-library/jest-dom';

// Mock Next.js navigation for client components
vi.mock('next/navigation', () => {
  const router = {
    push: vi.fn<(url: string) => void>(),
    replace: vi.fn<(url: string) => void>(),
    back: vi.fn<() => void>(),
  };
  return {
    useRouter: () => router,
    useSearchParams: () => ({ get: (_: string) => null as string | null }),
    __mockedRouter: router,
  };
});
