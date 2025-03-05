import { TRPCError } from "@trpc/server";
import { comparePassword, createToken } from "../domain/utils";
import { UserRepository } from "../repository/UserRepository";
import { Token } from "../models/models";

export class AuthService {
  public static async login(username: string, password: string): Promise<Token> {
    console.log("DEBUG >>>>");
    const user = await UserRepository.getByName(username);

    if (!user || !comparePassword(password, user.password)) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
    }

    return { value: createToken(user.username) };
  }
}