import reducer, { setCredentials, setUser, logout } from './authSlice';
import type { User } from '@/entities/user/types';

const initial: { token: string | null; user: User | null } = { token: null, user: null };

describe('authSlice', () => {
  it('sets credentials', () => {
    const state = reducer(initial, setCredentials({ token: 'abc' }));
    expect(state.token).toBe('abc');
  });

  it('sets user', () => {
    const user: User = { id: 1, name: 'A', surname: 'B', email: 'e', role: 'user' };
    const state = reducer(initial, setUser(user));
    expect(state.user).toEqual(user);
  });

  it('logout clears state', () => {
    const filled: typeof initial = { token: 't', user: { id: 1, name: 'A', surname: 'B', email: 'e', role: 'user' } };
    const state = reducer(filled, logout());
    expect(state).toEqual(initial);
  });
});
