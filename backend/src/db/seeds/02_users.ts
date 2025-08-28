import { Knex } from "knex";
import bcrypt from "bcryptjs";

export async function seed(knex: Knex): Promise<void> {
  // Clear existing users
  await knex("users").del();

  // Fetch role IDs by name to avoid relying on autoincrement order
  const roles = await knex("roles").select<{ id: number; name: string }[]>("id", "name");
  const roleIdByName = new Map(roles.map((r) => [r.name, r.id] as const));

  const adminRoleId = roleIdByName.get("admin");
  const userRoleId = roleIdByName.get("user");
  const clientRoleId = roleIdByName.get("client");

  if (!adminRoleId || !userRoleId || !clientRoleId) {
    throw new Error("Roles seed missing. Ensure 01_roles.ts ran successfully.");
  }

  // Prepare password hashes
  const [adminPass, userPass, clientPass] = await Promise.all([
    bcrypt.hash("admin123", 10),
    bcrypt.hash("user123", 10),
    bcrypt.hash("client123", 10),
  ]);

  // Insert one user per role
  await knex("users").insert([
    {
      name: "Admin",
      surname: "User",
      email: "admin@example.com",
      password: adminPass,
      role_id: adminRoleId,
    },
    {
      name: "Regular",
      surname: "User",
      email: "user@example.com",
      password: userPass,
      role_id: userRoleId,
    },
    {
      name: "Client",
      surname: "User",
      email: "client@example.com",
      password: clientPass,
      role_id: clientRoleId,
    },
  ]);
}

