import { Hono } from "hono";

type Bindings = {};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/api/", async (c) => {
  // const res = await c.env.SEARCH_SERVICE.search();
  return c.json({ name: "Hello World" });
});

export default app;
