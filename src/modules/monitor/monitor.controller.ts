import { Request, Response } from "express";
import monitorService from "./monitor.service";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import httpStatus from "http-status-codes";
import fs from "fs";
import { AppError } from "../../utils/AppError";

const monitor = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  
  let apiResponses: any[] = [];

  // 1. Handle JSON array or object in body
  if (Array.isArray(req.body)) {
    apiResponses = req.body;
  } else if (req.body && req.body.apiResponses && Array.isArray(req.body.apiResponses)) {
    apiResponses = req.body.apiResponses;
  } else if (req.body && typeof req.body === "object" && Object.keys(req.body).length > 0) {
    // Support single object in body
    apiResponses = [req.body];
  }

  // 2. Handle File Upload
  if (req.file) {
    try {
      const fileContent = fs.readFileSync(req.file.path, "utf-8");
      const parsedContent = JSON.parse(fileContent);
      
      let fileData: any[] = [];
      if (Array.isArray(parsedContent)) {
        fileData = parsedContent;
      } else if (parsedContent && parsedContent.apiResponses && Array.isArray(parsedContent.apiResponses)) {
        fileData = parsedContent.apiResponses;
      } else if (parsedContent && typeof parsedContent === "object") {
        // Support single object in file
        fileData = [parsedContent];
      }
      
      apiResponses = [...apiResponses, ...fileData];
      
      // Delete temp file
      fs.unlinkSync(req.file.path);
    } catch (error) {
      if (req.file) fs.unlinkSync(req.file.path);
      throw new AppError("Invalid JSON file content", httpStatus.BAD_REQUEST);
    }
  }

  if (apiResponses.length === 0) {
    throw new AppError("API responses are required. Provide an array in the body or a JSON file.", httpStatus.BAD_REQUEST);
  }

  const result = await monitorService.processMonitorData(userId, apiResponses);

  // Per strict requirements: Output MUST also be an ARRAY with same length
  res.status(httpStatus.CREATED).json(result);
});

export const monitorController = {
  monitor,
};

export default monitorController;
