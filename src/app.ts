import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import Logger from "./utils/logger";

const app: Application = express();

// Security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev", {
    stream: {
      write: (message) => Logger.http(message.trim()),
    },
  }));
}

// CORS configuration
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api/v1", router);

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ 
    status: "success", 
    message: "Intelligent API Monitoring System is running 🚀",
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ 
    status: "success", 
    message: "Welcome to Intelligent API Monitoring System API",
    version: "1.0.0"
  });
});

// 404 handler
app.use(notFound);

// Global error handler
app.use(globalErrorHandler);

export default app;