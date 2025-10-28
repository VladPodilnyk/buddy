import { WorkerEntrypoint } from "cloudflare:workers";

export default class SearchService extends WorkerEntrypoint {
  public fetch() {
    return new Response("OK", { status: 200 });
  }

  public async search() {
    return "Hello World!";
  }
}
