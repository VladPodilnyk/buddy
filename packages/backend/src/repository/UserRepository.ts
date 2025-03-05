import { sql } from "./db";

export class UserRepository {
  public static async insert(username: string, password: string): Promise<void> {
    await sql`INSERT INTO users (username, password) VALUES (${username}, ${password})`;
  }

  public static async getByName(username: string): Promise<UserRow | undefined> {
    const res = await sql`SELECT id, username, password FROM users WHERE username = ${username.toLowerCase()}`;
    if (res.length === 0) {
      return undefined;
    }
    // unsafe
    return Array.from(res.values())[0] as UserRow;
  }

  public static async getAllUsers(): Promise<string[]> {
    const rows = await sql`SELECT username FROM users`;
    return Array.from(rows.values()).map((v) => v.username);
  }
}

interface UserRow {
  id: number;
  username: string;
  password: string;
}
