import { asyncHandler } from './asyncHandler';
import type { Request, Response, NextFunction } from 'express';
import { describe, it, expect, vi } from 'vitest';
function makeReqResNext(): { req: Request; res: Response; next: NextFunction } {
  const req = {} as unknown as Request;
  const res = {} as unknown as Response;
  const next = vi.fn() as unknown as NextFunction;
  return { req, res, next };
}

describe('asyncHandler', () => {
  it('calls next on rejection', async () => {
    const { req, res, next } = makeReqResNext();
    const err = new Error('boom');
    const wrapped = asyncHandler(async () => { throw err; });
    await wrapped(req, res, next);
    expect(next).toHaveBeenCalledWith(err);
  });

  it('resolves without calling next when no error', async () => {
    const { req, res, next } = makeReqResNext();
    const wrapped = asyncHandler(async () => 'ok');
    await wrapped(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });
});
