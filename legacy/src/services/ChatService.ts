import express from "express";
import { EventEmitter } from "events";
import { verifyToken } from "../domain/utils";
import { MessageRepository } from "../repository/MessageRepository";
import { UserRepository } from "../repository/UserRepository";
import { EventHandler } from "../domain/EventHandler";
import { SendMessageData } from "../models/models";
import moment from "moment";

export class ChatService {
  private eventHandler: EventHandler;

  constructor(eventHandler: EventHandler) {
    this.eventHandler = eventHandler;
  }

  public getUserChats(username: string): Promise<string[]> {
    return MessageRepository.getReceivers(username);
  }

  public async sendMessage(data: SendMessageData): Promise<void> {
    const now = moment.now();
    const messageWithTimestamp = {...data, createdAt: now};
    await MessageRepository.insert(messageWithTimestamp);
    this.eventHandler.emit(messageWithTimestamp);
  }

  public getMessages(sender: string, receiver: string): Promise<SendMessageData[]> {
    return MessageRepository.getMessages(sender, receiver);
  }

  public getUsers(): Promise<string[]> {
    return UserRepository.getAllUsers();
  }
}