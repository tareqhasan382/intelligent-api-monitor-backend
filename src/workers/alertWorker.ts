import { Worker, Job } from "bullmq";
import config, { getRedisConnection } from "../config";
import Logger from "../utils/logger";
import { AlertJobData } from "../queues/alertQueue";
import { buildCacheKey, getCachedResponse, setCachedResponse } from "../cache/aiResponseCache";
import { generateIntelligentAlert, IGeminiAlertOutput } from "../utils/geminiUtils";
import Alert from "../modules/alert/alert.model";
import { sendHighSeverityAlertEmail } from "../utils/emailUtils";

const connection = getRedisConnection();

export const initAlertWorker = () => {
  const worker = new Worker(
    "alert-processing",
    async (job: Job<AlertJobData>) => {
      const { alertId, api_name, status_code, response_time_ms, records_returned, anomalyType } = job.data;
      Logger.info(`Processing job ${job.id} for alert ${alertId}`);

      try {
        // Step 1: Check Cache
        const cacheKey = buildCacheKey(api_name, status_code, anomalyType);
        const cached = await getCachedResponse(cacheKey);
        
        let aiResult: IGeminiAlertOutput;

        if (cached) {
          aiResult = JSON.parse(cached);
        } else {
          // Step 2: Call Gemini API
          aiResult = await generateIntelligentAlert({
            api_name,
            status_code,
            response_time_ms,
            records_returned,
            anomalyType,
          });

          // Step 3: Store in Cache (TTL 3600s)
          await setCachedResponse(cacheKey, JSON.stringify(aiResult), 3600);
        }

        // Step 4: Update MongoDB
        const aiDescription = `Root Cause: ${aiResult.rootCause}\nSeverity: ${aiResult.severity}\nRecommendation: ${aiResult.recommendation}`;
        
        await Alert.findByIdAndUpdate(alertId, {
          ai_description: aiDescription,
          severity: aiResult.severity.toLowerCase() as any, // Map AI severity to model severity
          alertStatus: "completed",
        });

        // Step 5: Trigger Email (if high severity)
        if (aiResult.severity === "HIGH" || aiResult.severity === "CRITICAL") {
          await sendHighSeverityAlertEmail({
            api_name,
            status_code,
            response_time_ms,
            records_returned,
            description: aiDescription,
            severity: aiResult.severity,
          });
        }

        Logger.info(`Successfully processed alert ${alertId}`);
      } catch (error) {
        Logger.error(`Error processing alert ${alertId}:`, error);
        
        await Alert.findByIdAndUpdate(alertId, {
          alertStatus: "failed",
        });
        
        throw error; // Let BullMQ handle retries
      }
    },
    { connection, concurrency: 5 }
  );

  worker.on("completed", (job) => {
    Logger.info(`Job ${job.id} completed successfully`);
  });

  worker.on("failed", (job, err) => {
    Logger.error(`Job ${job?.id} failed with error: ${err.message}`);
  });

  Logger.info("Alert Worker initialized and listening for jobs...");
  return worker;
};
