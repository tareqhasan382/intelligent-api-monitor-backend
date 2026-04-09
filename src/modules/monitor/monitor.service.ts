import Monitor from "./monitor.model";
import Alert from "../alert/alert.model";
import { IApiResponseData, IMonitor, IAlert } from "./monitor.interface";
import { addAlertJob } from "../../queues/alertQueue";
import Logger from "../../utils/logger";

const detectAnomaliesAndEnqueue = async (
  userId: string, 
  monitorId: string, 
  apiResponses: IApiResponseData[]
): Promise<void> => {
  const RESPONSE_TIME_THRESHOLD = 2000; // 2 seconds

  for (const response of apiResponses) {
    let hasAnomaly = false;
    let anomalyType: IAlert["anomalyType"] = "Unexpected Payload";
    let severity: IAlert["severity"] = "low";

    // 1. Check for Error Status Codes (4xx or 5xx)
    if (response.status_code >= 400) {
      hasAnomaly = true;
      anomalyType = "Error Status Code";
      severity = response.status_code >= 500 ? "high" : "medium";
    }
    // 2. Check for High Response Time
    else if (response.response_time_ms > RESPONSE_TIME_THRESHOLD) {
      hasAnomaly = true;
      anomalyType = "High Response Time";
      severity = "medium";
    }
    // 3. Check for Zero Records Returned (even if status 200)
    else if (response.records_returned === 0) {
      hasAnomaly = true;
      anomalyType = "Zero Records Returned";
      severity = "medium";
    }

    if (hasAnomaly) {
      // Create alert with pending status
      const alert = await Alert.create({
        userId,
        monitorId,
        api_name: response.api_name,
        status_code: response.status_code,
        response_time_ms: response.response_time_ms,
        anomalyType,
        description: `Issue detected on ${response.api_name}. Processing detailed AI analysis...`,
        severity,
        alertStatus: "pending",
        timestamp: new Date(),
        isResolved: false,
      });

      // Enqueue job for background AI processing
      await addAlertJob({
        alertId: alert.id,
        monitorId,
        api_name: response.api_name,
        status_code: response.status_code,
        response_time_ms: response.response_time_ms,
        records_returned: response.records_returned,
        anomalyType,
        userId,
      });
    }
  }
};

const processMonitorData = async (userId: string, apiResponses: IApiResponseData[]): Promise<IMonitor> => {
  // 1. Save monitor entry immediately
  const monitor = await Monitor.create({
    userId,
    apiResponses,
    processedAt: new Date(),
  });

  // 2. Detect and enqueue alerts (fire and forget)
  detectAnomaliesAndEnqueue(userId, monitor.id as string, apiResponses).catch(err => 
    Logger.error("Error in background anomaly detection:", err)
  );

  return monitor;
};

export const monitorService = {
  processMonitorData,
};

export default monitorService;
