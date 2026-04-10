import mongoose, { Schema } from "mongoose";
import { IMonitor } from "./monitor.interface";

const MonitorSchema = new Schema<IMonitor>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    apiResponses: [
      {
        api_name: { type: String, required: true },
        status_code: { type: Number, required: true },
        response_time_ms: { type: Number, required: true },
        records_returned: { type: Number, required: true },
        timestamp: { type: Date, default: Date.now },
        method: { type: String },
        endpoint: { type: String },
        payload: { type: Schema.Types.Mixed },
        responseBody: { type: Schema.Types.Mixed },
        is_slow: { type: Boolean, default: false },
        is_error: { type: Boolean, default: false },
        is_anomaly: { type: Boolean, default: false },
      },
    ],
    processedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

const Monitor = mongoose.model<IMonitor>("Monitor", MonitorSchema);

export default Monitor;
