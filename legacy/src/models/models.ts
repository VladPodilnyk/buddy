export interface UserData {
  username: string;
  password: string;
}

export interface SendMessageData {
  sender: string;
  receiver: string;
  message: string;
}

export interface GetMessagesData {
  token: string;
  senderId: number;
  receiverId: number;
}

export interface Message {
  id: number
  senderId: number;
  receiverId: number;
  message: string;
  created_at: number;
}

export interface Token {
  value: string;
}
