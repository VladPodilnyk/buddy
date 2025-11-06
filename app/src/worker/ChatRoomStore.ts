import { DurableObject } from "cloudflare:workers";

export class ChatRoomStore extends DurableObject<Env> {
  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
  }

  public async sayHello() {
    console.log("hit the DO");
    return "Hello, world!";
  }
}
