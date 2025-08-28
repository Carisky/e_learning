import * as usersRepo from '../../modules/users/user.repository';
import * as authLib from '../../lib/auth';
import bcrypt from 'bcryptjs';
import { login, refresh } from './auth.service';
import type { User } from '../users/user.types';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import jwt from 'jsonwebtoken';

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

describe('auth.service.refresh', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    process.env.JWT_SECRET = 'testsecret';
  });

  it('returns new token when given valid expired token', async () => {
    const old = jwt.sign({ id: 5, role: 'user' }, 'testsecret', { expiresIn: -1 });
    vi.spyOn(authLib, 'signToken').mockReturnValue('new-token');
    const res = await refresh(old);
    expect(authLib.signToken).toHaveBeenCalledWith(5, 'user');
    expect(res).toEqual({ token: 'new-token' });
  });

  it('throws on invalid token', async () => {
    await expect(refresh('bad')).rejects.toThrow('invalid token');
  });
});
