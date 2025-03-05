import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// TODO: do not repeat this at home xD
const SECRET = "donotrepeatthisathomeproduction"

export const hashPassword = (password: string) => bcrypt.hashSync(password);
export const comparePassword = (password: string, hash: string) => bcrypt.compareSync(password, hash);
export const createToken = (username: string) => jwt.sign({ username }, SECRET, { expiresIn: "1h" });
export const verifyToken = (token: string): { username: string } => {
  const decoded = jwt.verify(token, SECRET) as { username: string };
  return decoded;
};
