import express from "express";
import dotenv from "dotenv";
import path from "path";
import usersRouter from "./modules/users/user.routes";
import authRouter from "./modules/auth/auth.routes";
import coursesRouter from "./modules/courses/course.routes";
import { knex } from "./db/knex";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./config/swagger";
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// health + проверка коннекта к БД
app.get("/health", async (_req, res, next) => {
  try {
    await knex.raw("select 1");
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

// API
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/courses", coursesRouter);

// централизованный перехват ошибок
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "internal_error" });
});

const PORT = Number(process.env.PORT || 3300);
app.listen(PORT, () => console.log(`API on :${PORT}`));
