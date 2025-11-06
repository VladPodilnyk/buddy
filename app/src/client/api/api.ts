import type { AppType } from "../../worker/index";
import { hc } from "hono/client";

const client = hc<AppType>("buddy.vlad-podilnyk.workers.dev");

export default client;
