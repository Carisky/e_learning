// backend/src/config/knexfile.ts
import type { Knex } from "knex";
import dotenv from "dotenv";
import path from "path";

// Явно указываем путь к .env в корне backend
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      host: process.env.DB_HOST || "127.0.0.1",
      port: Number(process.env.DB_PORT || 5432),
      user: process.env.DB_USER || "app_user",
      password: process.env.DB_PASSWORD || "secret",
      database: process.env.DB_NAME || "app_db",
    },
    migrations: {
      // этот путь из папки backend/src/config указывает на backend/src/db/migrations
      directory: "../db/migrations",
      extension: "ts",
    },
    seeds: {
      directory: "../db/seeds",
      extension: "ts",
    },
  },
};

export default config;
