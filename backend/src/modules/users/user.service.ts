import * as repo from "./user.repository";
import { CreateUserDTO, UpdateUserDTO, User, UserDTO } from "./user.types";
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

function sanitize(user: User): UserDTO {
  const { password, ...rest } = user;
  return rest;
}

export async function getById(id: number): Promise<UserDTO | undefined> {
  const user = await repo.findById(id);
  return user && sanitize(user);
}

export async function getList(limit?: number, offset?: number) {
  const [items, total] = await Promise.all([repo.list(limit, offset), repo.count()]);
  return { items: items.map(sanitize), total };
}

export async function createUser(dto: CreateUserDTO): Promise<UserDTO> {
  assertCreate(dto);
  const exists = await repo.findByEmail(dto.email);
  if (exists) throw new Error("email already in use");
  const hash = await bcrypt.hash(dto.password, 10);
  const created = await repo.create({
    ...dto,
    password: hash,
    role_id: dto.role_id ?? 3,
  });
  return sanitize(created);
}

export async function updateUser(id: number, dto: UpdateUserDTO): Promise<UserDTO | undefined> {
  assertUpdate(dto);
  if (dto.email) {
    const other = await repo.findByEmail(dto.email);
    if (other && other.id !== id) throw new Error("email already in use");
  }
  const data: UpdateUserDTO = { ...dto };
  if (dto.password) data.password = await bcrypt.hash(dto.password, 10);
  const updated = await repo.update(id, data);
  return updated && sanitize(updated);
}

export async function deleteUser(id: number): Promise<void> {
  await repo.remove(id);
}
