import { Secret } from "jsonwebtoken";
import config from "../../config";
import {
  IUserCreateInput,
  IUserLoginInput,
  IUser,
} from "../user/user.interface";
import userService from "../user/user.service";
import User from "../user/user.model";
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status-codes";
import { AuthUtils } from "../../utils/authUtils";

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

const register = async (
  payload: IUserCreateInput
) => {
  const { email } = payload;
  
  // 1️ Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("User already exists", httpStatus.CONFLICT);
  }

  const user = await userService.createUser(payload);

  

  return user;
};

const login = async (
  payload: IUserLoginInput
): Promise<{ user: IUser } & Tokens> => {
  const { email, password } = payload;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError("Invalid credentials", httpStatus.UNAUTHORIZED);
  }

  const isPasswordMatch = await AuthUtils.comparePassword(password, user.password);
  if (!isPasswordMatch) {
    throw new AppError("Invalid credentials", httpStatus.UNAUTHORIZED);
  }

  const accessToken = AuthUtils.createToken(
    { sub: user._id, role: user.role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );
  const refreshToken = AuthUtils.createToken(
    { sub: user._id },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  return { user, accessToken, refreshToken };
};

export const authService = {
  register,
  login,
};

export default authService;
