import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/AppError";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
};

export default notFound;