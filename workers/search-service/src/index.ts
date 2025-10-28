import { WorkerEntrypoint } from "cloudflare:workers";

export default class SearchService extends WorkerEntrypoint {
  async search() {
    return "Hello World!";
  }
}
