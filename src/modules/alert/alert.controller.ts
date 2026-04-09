import { Request, Response } from "express";
import alertService from "./alert.service";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import httpStatus from "http-status-codes";

const getAllAlerts = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const result = await alertService.getAllAlerts(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Alerts fetched successfully",
    data: result,
  });
});

const getAlertById = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { id } = req.params;
  const result = await alertService.getAlertById(userId, id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Alert details fetched successfully",
    data: result,
  });
});

const resolveAlert = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { id } = req.params;
  const result = await alertService.resolveAlert(userId, id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Alert marked as resolved",
    data: result,
  });
});

export const alertController = {
  getAllAlerts,
  getAlertById,
  resolveAlert,
};

export default alertController;
