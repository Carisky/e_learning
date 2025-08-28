import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("course_files", (table) => {
    table.increments("id").primary();
    table
      .integer("course_id")
      .notNullable()
      .references("id")
      .inTable("courses")
      .onDelete("CASCADE");
    table.string("url", 1024).notNullable();
    table.string("type", 50);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("course_files");
}
