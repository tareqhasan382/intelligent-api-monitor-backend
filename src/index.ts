import { Server } from "http";
import app from "./app";
import config from "./config";
import connectDB from "./config/db";
import Logger from "./utils/logger";
import { initAlertWorker } from "./workers/alertWorker";

let server: Server;

// Uncaught exceptions
process.on("uncaughtException", (err) => {
  Logger.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  Logger.error(err.name, err.message);
  process.exit(1);
});

async function main() {
  try {
    // Connect to database
    await connectDB();

    // Initialize BullMQ Worker
    initAlertWorker();

    server = app.listen(config.port, () => {
      Logger.info(`Server is running on http://localhost:${config.port}`);
    });
  } catch (err) {
    Logger.error(err);
    process.exit(1);
  }
}

main();

// Unhandled rejections
process.on("unhandledRejection", (err: any) => {
  Logger.error("UNHANDLED REJECTION! 💥 Shutting down...");
  Logger.error(err.name, err.message);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// SIGTERM handling
process.on("SIGTERM", () => {
  Logger.info("👋 SIGTERM RECEIVED. Shutting down gracefully");
  if (server) {
    server.close(() => {
      Logger.info("💥 Process terminated!");
    });
  }
});
