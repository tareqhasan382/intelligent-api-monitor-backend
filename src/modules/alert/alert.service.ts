import Alert from "./alert.model";
import { IAlert } from "../monitor/monitor.interface";
import mongoose from "mongoose";

const getAllAlerts = async (userId: string): Promise<IAlert[]> => {
  return await Alert.find({ userId }).sort({ timestamp: -1 });
};

const getAlertById = async (userId: string, id: string): Promise<IAlert | null> => {
  return await Alert.findOne({ userId, _id: id });
};

const resolveAlert = async (userId: string, id: string): Promise<IAlert | null> => {
  return await Alert.findOneAndUpdate(
    { userId, _id: id },
    { isResolved: true },
    { new: true }
  );
};

const getAlertStats = async (userId: string) => {
  const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const stats = await Alert.aggregate([
    {
      $match: {
        userId: userId,
        timestamp: { $gte: last24Hours },
      },
    },
    {
      $group: {
        _id: {
          api_name: "$api_name",
          status_code: "$status_code",
        },
        failureCount: { $sum: 1 },
        avgResponseTime: { $avg: "$response_time_ms" },
      },
    },
    {
      $project: {
        _id: 0,
        api_name: "$_id.api_name",
        status_code: "$_id.status_code",
        failureCount: 1,
        avgResponseTime: 1,
      },
    },
    {
      $sort: { failureCount: -1 },
    },
    {
      $limit: 10,
    },
  ]);

  return stats;
};

export const alertService = {
  getAllAlerts,
  getAlertById,
  resolveAlert,
  getAlertStats,
};

export default alertService;
