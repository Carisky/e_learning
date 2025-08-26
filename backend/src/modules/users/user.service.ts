import * as repo from "./user.repository";
import { CreateUserDTO, UpdateUserDTO, User } from "./user.types";
import bcrypt from "bcryptjs";

function assertCreate(dto: CreateUserDTO) {
  if (!dto.name?.trim()) throw new Error("name is required");
  if (!dto.surname?.trim()) throw new Error("surname is required");
  if (!dto.email?.trim()) throw new Error("email is required");
  if (!dto.password || dto.password.length < 6) throw new Error("password min 6 chars");
}

function assertUpdate(dto: UpdateUserDTO) {
  if (dto.password && dto.password.length < 6) throw new Error("password min 6 chars");
}

export async function getById(id: number): Promise<User | undefined> {
  return repo.findById(id);
}

export async function getList(limit?: number, offset?: number) {
  const [items, total] = await Promise.all([repo.list(limit, offset), repo.count()]);
  return { items, total };
}

export async function createUser(dto: CreateUserDTO): Promise<User> {
  assertCreate(dto);
  const exists = await repo.findByEmail(dto.email);
  if (exists) throw new Error("email already in use");
  const hash = await bcrypt.hash(dto.password, 10);
  return repo.create({ ...dto, password: hash });
}

export async function updateUser(id: number, dto: UpdateUserDTO): Promise<User | undefined> {
  assertUpdate(dto);
  if (dto.email) {
    const other = await repo.findByEmail(dto.email);
    if (other && other.id !== id) throw new Error("email already in use");
  }
  const data: UpdateUserDTO = { ...dto };
  if (dto.password) data.password = await bcrypt.hash(dto.password, 10);
  return repo.update(id, data);
}

export async function deleteUser(id: number): Promise<void> {
  await repo.remove(id);
}
