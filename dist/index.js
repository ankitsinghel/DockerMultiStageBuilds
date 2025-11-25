import express from "express";
import { Client } from "pg";
const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.use(express.json());
const client = new Client({
    user: process.env.PGUSER ?? "postgres",
    host: process.env.PGHOST ?? "localhost",
    database: process.env.PGDATABASE ?? "postgres",
    password: process.env.PGPASSWORD ?? "postgres",
    port: Number(process.env.PGPORT ?? 5431),
});
(async () => {
    try {
        await client.connect();
        // eslint-disable-next-line no-console
        console.log("Postgres connected");
    }
    catch (err) {
        // eslint-disable-next-line no-console
        console.error("Postgres connection error:", err);
    }
})();
app.get("/", (_req, res) => {
    res.send("Hello World!");
});
app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});
app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening at http://localhost:${port}`);
});
export default app;
//# sourceMappingURL=index.js.map