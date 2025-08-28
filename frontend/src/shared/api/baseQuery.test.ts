import { baseQuery } from './baseQuery';
import type { BaseQueryApi, FetchArgs } from '@reduxjs/toolkit/query';
import { vi } from 'vitest';

function createMockApi(): BaseQueryApi {
  return {
    signal: new AbortController().signal,
    abort: () => {},
    dispatch: vi.fn(),
    getState: () => ({}),
    extra: undefined,
    endpoint: '',
    type: 'query',
  };
}

// Универсально достаём Authorization из вызова fetch (Request | (url, options))
const getAuthFromFetch = (mockedFetch: ReturnType<typeof vi.fn>) => {
  const call = mockedFetch.mock.calls[0] ?? [];
  const first = call[0] as unknown;
  const second = call[1] as RequestInit | undefined;

  // Случай fetch(new Request(...))
  if (first instanceof Request) {
    return first.headers.get('Authorization');
  }

  // Случай fetch(url, options)
  const h = second?.headers;
  if (h instanceof Headers) return h.get('Authorization');
  if (h && typeof h === 'object') return new Headers(h as Record<string, string>).get('Authorization');
  return null;
};

describe('baseQuery', () => {
  beforeEach(() => {
    const resp = new Response(JSON.stringify({}), { status: 200, headers: {} });
    vi.restoreAllMocks();
    global.fetch = vi.fn().mockResolvedValue(resp) as unknown as typeof fetch;
    localStorage.clear();
  });

  it('adds Authorization header when token in localStorage', async () => {
    localStorage.setItem('token', 'XYZ');

    await baseQuery({ url: '/test' } as FetchArgs, createMockApi(), {});

    const mockedFetch = global.fetch as unknown as ReturnType<typeof vi.fn>;
    expect(getAuthFromFetch(mockedFetch)).toBe('Bearer XYZ');
  });

  it('does not add header when no token', async () => {
    localStorage.removeItem('token');

    await baseQuery({ url: '/test' } as FetchArgs, createMockApi(), {});

    const mockedFetch = global.fetch as unknown as ReturnType<typeof vi.fn>;
    expect(getAuthFromFetch(mockedFetch)).toBeNull();
  });
});
