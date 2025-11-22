import express from "express";
const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.use(express.json());
app.get("/", (_req, res) => {
    res.send("Hello World!");
});
app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});
if (require.main === module) {
    app.listen(port, () => {
        // eslint-disable-next-line no-console
        console.log(`Server listening at http://localhost:${port}`);
    });
}
export default app;
//# sourceMappingURL=index.js.map