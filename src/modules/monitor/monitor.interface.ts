export interface IApiResponseData {
  api_name: string;
  status_code: number;
  response_time_ms: number;
  records_returned: number;
  timestamp?: Date;
  method?: string;
  endpoint?: string;
  payload?: any;
  responseBody?: any;
}

export interface IMonitor {
  _id?: string;
  userId: string;
  apiResponses: IApiResponseData[];
  processedAt: Date;
}

export type AlertStatus = "pending" | "processing" | "completed" | "failed";

export interface IAlert {
  _id?: string;
  userId: string;
  monitorId: string;
  api_name: string;
  status_code?: number;
  response_time_ms?: number; // Added for stats aggregation
  anomalyType: "High Response Time" | "Error Status Code" | "Zero Records Returned" | "Unexpected Payload";
  description: string;
  ai_description?: string;
  severity: "low" | "medium" | "high";
  alertStatus: AlertStatus;
  timestamp: Date;
  isResolved: boolean;
}
