import { Hono } from "hono";

const app = new Hono();

app.get("/api/", (c) => c.json({ name: "Hello world!" }));

export default app;
