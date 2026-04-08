import mongoose from "mongoose";
import config from "./index";
import Logger from "../utils/logger";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.database_url as string);
    Logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    Logger.error(`Error connecting to MongoDB: ${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }
};

export default connectDB;
