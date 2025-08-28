import { authMiddleware, requireRole, requireSelfOrRole, signToken, optionalAuth, type AuthRequest } from './auth';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import type { Response } from 'express';
import { describe, it, expect, vi, beforeEach } from 'vitest';
type Res = { status: (code: number) => Res; json: (body: unknown) => Res };
function makeRes(): Response {
  const res = {} as Res;
  const status = vi.fn<(code: number) => Res>();
  const json = vi.fn<(body: unknown) => Res>();
  status.mockReturnValue(res);
  json.mockReturnValue(res);
  res.status = status;
  res.json = json;
  return res as unknown as Response;
}

describe('signToken', () => {
  it('signs a token with id and role', () => {
    process.env.JWT_SECRET = 'testsecret';
    const token = signToken(123, 'admin');
    const payload = jwt.verify(token, 'testsecret') as JwtPayload & { id: number; role: string };
    expect(payload.id).toBe(123);
    expect(payload.role).toBe('admin');
  });
});

describe('authMiddleware', () => {
  beforeEach(() => { process.env.JWT_SECRET = 'testsecret'; });

  it('rejects when no Authorization header', () => {
    const req = { headers: {} } as unknown as AuthRequest;
    const res = makeRes();
    const next = vi.fn();
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'unauthorized' });
  });

  it('rejects when invalid token', () => {
    const req = { headers: { authorization: 'Bearer badtoken' } } as unknown as AuthRequest;
    const res = makeRes();
    const next = vi.fn();
    authMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'invalid_token' });
  });

  it('sets user and calls next for valid token', () => {
    const token = jwt.sign({ id: 7, role: 'user' }, 'testsecret');
    const req = { headers: { authorization: `Bearer ${token}` } } as unknown as AuthRequest;
    const res = makeRes();
    const next = vi.fn();
    authMiddleware(req, res, next);
    expect((req as AuthRequest).user).toMatchObject({ id: 7, role: 'user' });
    expect(next).toHaveBeenCalled();
  });
});

describe('requireRole', () => {
  it('forbids when user missing or role mismatch', () => {
    const req = { user: { id: 1, role: 'user' }, params: {} } as unknown as AuthRequest;
    const res = makeRes();
    const next = vi.fn();
    requireRole('admin')(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'forbidden' });
  });

  it('passes when role matches', () => {
    const req = { user: { id: 1, role: 'admin' }, params: {} } as unknown as AuthRequest;
    const res = makeRes();
    const next = vi.fn();
    requireRole('admin')(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});

describe('requireSelfOrRole', () => {
  it('allows self', () => {
    const req = { user: { id: 5, role: 'user' }, params: { id: '5' } } as unknown as AuthRequest;
    const res = makeRes();
    const next = vi.fn();
    requireSelfOrRole('admin')(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('allows privileged role', () => {
    const req = { user: { id: 5, role: 'admin' }, params: { id: '6' } } as unknown as AuthRequest;
    const res = makeRes();
    const next = vi.fn();
    requireSelfOrRole('admin')(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('forbids otherwise', () => {
    const req = { user: { id: 5, role: 'user' }, params: { id: '6' } } as unknown as AuthRequest;
    const res = makeRes();
    const next = vi.fn();
    requireSelfOrRole('admin')(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'forbidden' });
  });
});

describe('optionalAuth', () => {
  beforeEach(() => { process.env.JWT_SECRET = 'testsecret'; });

  it('calls next when header missing', () => {
    const req = { headers: {} } as unknown as AuthRequest;
    const res = makeRes();
    const next = vi.fn();
    optionalAuth(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toBeUndefined();
  });

  it('sets user when token provided', () => {
    const token = jwt.sign({ id: 9, role: 'user' }, 'testsecret');
    const req = { headers: { authorization: `Bearer ${token}` } } as unknown as AuthRequest;
    const res = makeRes();
    const next = vi.fn();
    optionalAuth(req, res, next);
    expect(req.user).toMatchObject({ id: 9, role: 'user' });
    expect(next).toHaveBeenCalled();
  });
});
