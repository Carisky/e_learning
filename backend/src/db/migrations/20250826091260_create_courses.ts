import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("courses", (table) => {
    table.increments("id").primary();
    table.string("title", 255).notNullable();
    table.text("description").notNullable();
    table.integer("price").notNullable().defaultTo(0); // stored in cents
    table.integer("duration").notNullable(); // in minutes
    table
      .integer("category_id")
      .references("id")
      .inTable("categories")
      .onDelete("SET NULL");
    table
      .integer("author_id")
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");
    table.string("preview_url", 1024);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("courses");
}
