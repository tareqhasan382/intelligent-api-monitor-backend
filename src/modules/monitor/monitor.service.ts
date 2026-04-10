import Monitor from "./monitor.model";
import Alert from "../alert/alert.model";
import { IApiResponseData, IMonitor, IAlert } from "./monitor.interface";
import { addAlertJob } from "../../queues/alertQueue";
import Logger from "../../utils/logger";

const detectAnomaliesAndEnqueue = async (
  userId: string, 
  monitorId: string, 
  apiResponses: IApiResponseData[]
): Promise<IApiResponseData[]> => {
  const RESPONSE_TIME_THRESHOLD = 500; // 500ms threshold per requirement

  const processedResponses = await Promise.all(apiResponses.map(async (response) => {
    let hasAnomaly = false;
    let anomalyType: IAlert["anomalyType"] = "Unexpected Payload";
    let severity: IAlert["severity"] = "low";

    // Mark slow if > 500ms
    const isSlow = response.response_time_ms > RESPONSE_TIME_THRESHOLD;
    
    // Mark error if not 2xx
    const isError = response.status_code < 200 || response.status_code >= 300;
    
    // Mark anomaly if 0 records with status 200
    const isAnomaly = response.records_returned === 0 && response.status_code === 200;

    if (isError) {
      hasAnomaly = true;
      anomalyType = "Error Status Code";
      severity = response.status_code >= 500 ? "high" : "medium";
    } else if (isSlow) {
      hasAnomaly = true;
      anomalyType = "High Response Time";
      severity = "medium";
    } else if (isAnomaly) {
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

    return {
      ...response,
      is_slow: isSlow,
      is_error: isError,
      is_anomaly: isAnomaly
    };
  }));

  return processedResponses;
};

const processMonitorData = async (userId: string, apiResponses: IApiResponseData[]): Promise<IApiResponseData[]> => {
  // 1. Process data first to get markers
  const RESPONSE_TIME_THRESHOLD = 500;
  
  const processedData = apiResponses.map(response => ({
    ...response,
    is_slow: response.response_time_ms > RESPONSE_TIME_THRESHOLD,
    is_error: response.status_code < 200 || response.status_code >= 300,
    is_anomaly: response.records_returned === 0 && response.status_code === 200
  }));

  // 2. Save monitor entry immediately
  const monitor = await Monitor.create({
    userId,
    apiResponses: processedData,
    processedAt: new Date(),
  });

  // 3. Detect and enqueue alerts (fire and forget)
  detectAnomaliesAndEnqueue(userId, monitor.id as string, processedData).catch(err => 
    Logger.error("Error in background anomaly detection:", err)
  );

  return processedData;
};

export const monitorService = {
  processMonitorData,
};

export default monitorService;
