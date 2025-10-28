import { Hono } from "hono";
import type SearchService from "../../../search-service/src/index";

type Bindings = {
  SEARCH_SERVICE: Service<SearchService>;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/api/", async (c) => {
  const res = await c.env.SEARCH_SERVICE.search();
  return c.json({ name: res });
});

export default app;
