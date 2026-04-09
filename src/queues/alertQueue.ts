import { Queue } from "bullmq";
import config, { getRedisConnection } from "../config";
import Logger from "../utils/logger";

export interface AlertJobData {
  alertId: string;
  monitorId: string;
  api_name: string;
  status_code: number;
  response_time_ms: number;
  records_returned: number;
  anomalyType: string;
  userId: string;
}

const connection = getRedisConnection();

export const alertQueue = new Queue("alert-processing", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

export const addAlertJob = async (data: AlertJobData) => {
  try {
    await alertQueue.add("process-ai-alert", data);
    Logger.info(`Job enqueued: alert-processing for alert ${data.alertId}`);
  } catch (error) {
    Logger.error("Failed to enqueue alert job:", error);
  }
};
