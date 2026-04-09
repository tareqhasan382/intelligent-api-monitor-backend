import { z } from "zod";

export const apiResponseDataSchema = z.object({
  api_name: z.string().min(1, "API name is required"),
  status_code: z.number().int().min(100).max(599),
  response_time_ms: z.number().min(0),
  records_returned: z.number().min(0),
  timestamp: z.string().optional().transform((val) => val ? new Date(val) : new Date()),
  method: z.string().optional(),
  endpoint: z.string().optional(),
  payload: z.any().optional(),
  responseBody: z.any().optional(),
});

export const monitorInputSchema = z.union([
  z.object({
    body: z.array(apiResponseDataSchema).nonempty("API responses array cannot be empty"),
  }),
  z.object({
    body: z.object({
      apiResponses: z.array(apiResponseDataSchema).nonempty("API responses array cannot be empty"),
    }),
  }),
]);

export type MonitorInput = z.infer<typeof monitorInputSchema>;
