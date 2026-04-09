import { Request, Response } from "express";
import userService from "./user.service";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import httpStatus from "http-status-codes";
import { AppError } from "../../utils/AppError";

const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.getMe((req as any).user.id);
  
  if (!user) {
    throw new AppError("User not found", httpStatus.NOT_FOUND);
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile fetched successfully",
    data: user,
  });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await userService.getUserById(id as string);
  
  if (!user) {
    throw new AppError("User not found", httpStatus.NOT_FOUND);
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User fetched successfully",
    data: user,
  });
});

export const userController = {
  getMe,
  getUserById,
};

export default userController;
