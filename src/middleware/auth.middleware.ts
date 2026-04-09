import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import { AppError } from "../utils/AppError";
import catchAsync from "../shared/catchAsync";
import httpStatus from "http-status-codes";

interface JwtPayload {
  sub: string;
  role?: string;
  iat?: number;
  exp?: number;
}

const auth = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Unauthorized", httpStatus.UNAUTHORIZED);
  }
  
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, config.jwt.secret as string) as JwtPayload;
    (req as any).user = { id: decoded.sub, role: decoded.role };
    next();
  } catch (error) {
    throw new AppError("Invalid or expired token", httpStatus.UNAUTHORIZED);
  }
});

export default auth;
