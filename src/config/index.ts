import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const redisOptions = {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT!),
  password: process.env.REDIS_PASSWORD || undefined,
};

// Helper to get Redis connection options without empty password
export const getRedisConnection = () => {
  const options: any = {
    host: redisOptions.host,
    port: redisOptions.port,
  };
  if (redisOptions.password && redisOptions.password.trim() !== "") {
    options.password = redisOptions.password;
  }
  return options;
};

export default {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "5000", 10),
  database_url: process.env.DATABASE_URL,
  
  redis: redisOptions,

  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
  },

  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM,
    adminEmail: process.env.ADMIN_EMAIL,
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
    bycrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  },
};
