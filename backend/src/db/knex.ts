import knexFactory, { Knex } from "knex";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const knex: Knex = knexFactory({
  client: "pg",
  connection: {
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER || "app_user",
    password: process.env.DB_PASSWORD || "secret",
    database: process.env.DB_NAME || "app_db",
  },
  pool: { min: 0, max: 10 },
});
