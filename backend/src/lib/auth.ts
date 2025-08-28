import { Request, Response, NextFunction } from "express";
import jwt, { Secret, SignOptions } from "jsonwebtoken";

export interface JwtUser {
  id: number;
  role: string;
}

export interface AuthRequest extends Request {
  user?: JwtUser;
}

export function signToken(id: number, role: string) {
  const secret: Secret = process.env.JWT_SECRET || "secret";
  const expiresIn = process.env.JWT_EXPIRES_IN || "1h";
  const options: SignOptions = { expiresIn: expiresIn as any };
  return jwt.sign({ id, role }, secret, options);
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "unauthorized" });
  const token = auth.split(" ")[1];
  if (!token) return res.status(401).json({ error: "unauthorized" });
  try {
    const secret = process.env.JWT_SECRET || "secret";
    const payload = jwt.verify(token, secret) as JwtUser;
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: "invalid_token" });
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "forbidden" });
    }
    next();
  };
}

export function requireSelfOrRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const id = Number(req.params.id);
    if (!req.user) return res.status(403).json({ error: "forbidden" });
    if (req.user.id === id || roles.includes(req.user.role)) {
      return next();
    }
    return res.status(403).json({ error: "forbidden" });
  };
}

export function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (auth) {
    const token = auth.split(" ")[1];
    if (token) {
      try {
        const secret = process.env.JWT_SECRET || "secret";
        const payload = jwt.verify(token, secret) as JwtUser;
        req.user = payload;
      } catch {}
    }
  }
  next();
}
