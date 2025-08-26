import { knex } from "../../db/knex";
import { CreateUserDTO, UpdateUserDTO, User } from "./user.types";

const TABLE = "users";

export async function findById(id: number): Promise<User | undefined> {
  return knex<User>(TABLE).where({ id }).first();
}

export async function findByEmail(email: string): Promise<User | undefined> {
  return knex<User>(TABLE).where({ email }).first();
}

export async function findByEmailWithRole(
  email: string
): Promise<(User & { role: string }) | undefined> {
  return knex<User>(TABLE)
    .select("users.*", "roles.name as role")
    .leftJoin("roles", "users.role_id", "roles.id")
    .where("users.email", email)
    .first();
}

export async function list(limit = 20, offset = 0): Promise<User[]> {
  return knex<User>(TABLE).select("*").limit(limit).offset(offset).orderBy("id", "asc");
}

export async function create(data: CreateUserDTO): Promise<User> {
  const [row] = await knex<User>(TABLE).insert(data).returning("*");
  return row;
}

export async function update(id: number, data: UpdateUserDTO): Promise<User | undefined> {
  const [row] = await knex<User>(TABLE).where({ id }).update(data).returning("*");
  return row;
}

export async function remove(id: number): Promise<number> {
  return knex<User>(TABLE).where({ id }).del();
}

export async function count(): Promise<number> {
  const res = await knex<User>(TABLE).count<{ count: string }>("* as count").first();
  return Number(res?.count || 0);
}
