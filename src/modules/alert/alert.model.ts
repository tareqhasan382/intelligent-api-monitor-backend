import mongoose, { Schema } from "mongoose";
import { IAlert } from "../monitor/monitor.interface";

const AlertSchema = new Schema<IAlert>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    monitorId: {
      type: String,
      required: true,
      index: true,
    },
    api_name: {
      type: String,
      required: true,
      index: { sparse: true },
    },
    status_code: {
      type: Number,
      index: true,
    },
    response_time_ms: {
      type: Number,
    },
    anomalyType: {
      type: String,
      enum: ["High Response Time", "Error Status Code", "Zero Records Returned", "Unexpected Payload"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    ai_description: {
      type: String,
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    alertStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    isResolved: {
      type: Boolean,
      default: false,
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

// Compound index for fast alerts queries
AlertSchema.index({ userId: 1, timestamp: -1 });

const Alert = mongoose.model<IAlert>("Alert", AlertSchema);

export default Alert;
