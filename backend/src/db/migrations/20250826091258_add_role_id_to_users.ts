import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("users", (table) => {
    table
      .integer("role_id")
      .notNullable()
      .references("id")
      .inTable("roles")
      .defaultTo(3);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("users", (table) => {
    table.dropColumn("role_id");
  });
}
