import User from "./user.model";
import {
  IUser,
  IUserCreateInput,
} from "./user.interface";
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status-codes";

const createUser = async (payload: IUserCreateInput): Promise<IUser> => {
  const existing = await User.findOne({ email: payload.email });
  if (existing) {
    throw new AppError("Email already in use", httpStatus.BAD_REQUEST);
  }

  const user = await User.create(payload);
  return user;
};

const getUserById = async (id: string): Promise<IUser | null> => {
  return await User.findById(id);
};

const getUserByEmail = async (email: string): Promise<IUser | null> => {
  return await User.findOne({ email });
};

const getMe = async (userId: string): Promise<IUser | null> => {
  return await User.findById(userId);
};

export default {
  createUser,
  getUserById,
  getUserByEmail,
  getMe,
};
