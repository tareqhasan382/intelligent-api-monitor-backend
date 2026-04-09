import * as jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Secret } from "jsonwebtoken";

const createToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expireTime: string
): string => {
  return jwt.sign(payload, secret, {
    expiresIn: expireTime as jwt.SignOptions["expiresIn"],
  });
};

const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret);
};

const hashPassword = async (password: string, saltRounds: number): Promise<string> => {
  return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export const AuthUtils = {
  createToken,
  verifyToken,
  hashPassword,
  comparePassword,
};
