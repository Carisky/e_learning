import reducer, { selectUser } from './usersSlice';
import type { AnyAction } from '@reduxjs/toolkit';

describe('usersSlice', () => {
  it('selectUser sets selectedId', () => {
    const state = reducer(undefined, { type: '@@INIT' } as AnyAction);
    const next = reducer(state, selectUser(42));
    expect(next.selectedId).toBe(42);
  });
});
