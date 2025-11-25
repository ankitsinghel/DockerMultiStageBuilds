import express from "express";
import type { Request, Response } from "express";
import { Client } from "pg";

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(express.json());

const client = new Client({
  user: process.env.PGUSER ?? "postgres",
  host: process.env.PGHOST ?? "db",
  database: process.env.PGDATABASE ?? "postgres",
  password: process.env.PGPASSWORD ?? "postgres",
  port: Number(process.env.PGPORT ?? 5432),
});

(async () => {
  try {
    await client.connect();
    // eslint-disable-next-line no-console
    console.log("Postgres connected");
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Postgres connection error:", err);
  }
})();

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening at http://localhost:${port}`);
});

export default app;
