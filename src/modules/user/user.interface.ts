import { Model } from "mongoose";

export type UserRole = "admin" | "user";

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  password: string;
  passwordSalt?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserSafe {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserCreateInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface IUserLoginInput {
  email: string;
  password: string;
}

export type IUserModel = Model<IUser, Record<string, never>>;
