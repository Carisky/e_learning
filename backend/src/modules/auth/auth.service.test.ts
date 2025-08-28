import * as usersRepo from '../../modules/users/user.repository';
import * as authLib from '../../lib/auth';
import bcrypt from 'bcryptjs';
import { login } from './auth.service';
import type { User } from '../users/user.types';
import { vi, describe, beforeEach, it, expect } from 'vitest';

vi.mock('../../modules/users/user.repository');
vi.mock('../../lib/auth');

describe('auth.service.login', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns token on valid credentials', async () => {
    const user: User & { role: string } = {
      id: 1,
      email: 'a@b.c',
      name: 'A',
      surname: 'B',
      password: 'hashed',
      role: 'admin',
      role_id: 1,
    };

    vi.spyOn(usersRepo, 'findByEmailWithRole').mockResolvedValue(user);
    vi.spyOn(bcrypt, 'compare').mockImplementation(async () => true);
    vi.spyOn(authLib, 'signToken').mockReturnValue('jwt-token');

    const res = await login('a@b.c', 'secret');
    expect(res).toEqual({ token: 'jwt-token' });
  });

  it('throws on missing user', async () => {
    vi.spyOn(usersRepo, 'findByEmailWithRole').mockResolvedValue(undefined);
    await expect(login('x@y.z', 'p')).rejects.toThrow('invalid credentials');
  });

  it('throws on wrong password', async () => {
    const user: User & { role: string } = {
      id: 2,
      email: 'x@y.z',
      name: 'X',
      surname: 'Y',
      password: 'hash',
      role: 'user',
      role_id: 2,
    };

    vi.spyOn(usersRepo, 'findByEmailWithRole').mockResolvedValue(user);
    vi.spyOn(bcrypt, 'compare').mockImplementation(async () => false);

    await expect(login('a', 'b')).rejects.toThrow('invalid credentials');
  });
});
