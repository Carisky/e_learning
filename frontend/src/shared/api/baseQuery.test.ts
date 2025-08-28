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
const getAuthFromFetch = (mockedFetch: ReturnType<typeof vi.fn>, callIndex = 0) => {
  const call = mockedFetch.mock.calls[callIndex] ?? [];
  const first = call[0] as unknown;
  const second = call[1] as RequestInit | undefined;

  if (first instanceof Request) {
    return first.headers.get('Authorization');
  }

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

  it('refreshes token on 401 and retries request', async () => {
    localStorage.setItem('token', 'OLD');

    const resp401 = new Response('', { status: 401 });
    const respRefresh = new Response(JSON.stringify({ token: 'NEW' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    const respOk = new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    global.fetch = vi
      .fn()
      .mockResolvedValueOnce(resp401)
      .mockResolvedValueOnce(respRefresh)
      .mockResolvedValueOnce(respOk) as unknown as typeof fetch;

    const res = await baseQuery(
      { url: '/test' } as FetchArgs,
      createMockApi(),
      {},
    );

    const mockedFetch = global.fetch as unknown as ReturnType<typeof vi.fn>;
    expect(res.data).toEqual({ ok: true });
    expect(mockedFetch).toHaveBeenCalledTimes(3);
    expect(getAuthFromFetch(mockedFetch, 0)).toBe('Bearer OLD');
    expect(getAuthFromFetch(mockedFetch, 1)).toBe('Bearer OLD');
    expect(getAuthFromFetch(mockedFetch, 2)).toBe('Bearer NEW');
    expect(localStorage.getItem('token')).toBe('NEW');
  });
});
