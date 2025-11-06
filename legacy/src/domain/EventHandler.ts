import EventEmitter from "events";
import express from "express";

export class EventHandler {
  private constructor(
    private emitter: EventEmitter,
) {}

  public static init(activeConnections: Map<string, express.Response>): EventHandler {
    const sendMessage = (message: ChatEvent) => {
      for (const user of [message.receiver, message.sender]) {
        if (activeConnections.get(user)) {
          activeConnections.get(user)?.write(`data: ${JSON.stringify(message)}\n\n`);
        }
      }
    };

    const emitter = new EventEmitter();
    emitter.on("message", sendMessage);
    return new EventHandler(emitter);
  }

  public emit(message: ChatEvent) {
    this.emitter.emit("message", message);
  }
}

interface ChatEvent {
  sender: string;
  receiver: string;
}