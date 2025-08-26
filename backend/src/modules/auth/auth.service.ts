import bcrypt from "bcryptjs";
import * as usersRepo from "../users/user.repository";
import { signToken } from "../../lib/auth";

export async function login(email: string, password: string) {
  const user = await usersRepo.findByEmailWithRole(email);
  if (!user) throw new Error("invalid credentials");
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error("invalid credentials");
  const token = signToken(user.id, user.role);
  return { token };
}
