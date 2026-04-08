import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });
 
export default {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "5000", 10),
  database_url: process.env.DATABASE_URL,
  
  redis: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
    password: process.env.REDIS_PASSWORD,
  },

  llm: {
    apiKey: process.env.LLM_API_KEY,
    modelName: process.env.LLM_MODEL_NAME || "gpt-4o",
  },

  multer: {
    maxSize: parseInt(process.env.MAX_FILE_SIZE || "5242880", 10),
    uploadPath: process.env.UPLOAD_PATH || "./uploads",
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    expires_in: process.env.JWT_EXPIRES_IN,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  },
};