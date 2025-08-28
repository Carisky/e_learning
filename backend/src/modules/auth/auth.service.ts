import bcrypt from "bcryptjs";
import * as usersRepo from "../users/user.repository";
import { signToken, type JwtUser } from "../../lib/auth";
import jwt from "jsonwebtoken";

export async function login(email: string, password: string) {
  const user = await usersRepo.findByEmailWithRole(email);
  if (!user) throw new Error("invalid credentials");
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error("invalid credentials");
  const token = signToken(user.id, user.role);
  return { token };
}

export async function refresh(oldToken: string) {
  const secret = process.env.JWT_SECRET || "secret";
  try {
    const payload = jwt.verify(oldToken, secret, { ignoreExpiration: true }) as JwtUser;
    const token = signToken(payload.id, payload.role);
    return { token };
  } catch (e) {
    throw new Error("invalid token");
  }
}
