import express, { Application, Request, Response, NextFunction } from "express";
const app: Application = express();
import cors from "cors";
import router from "./app/routes";
import notFound from "./app/middlewares/notFound";

const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/", router);
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ status: 200, message: "Our server is Running 🚀" });
});

// 404 handler
app.use(notFound);

// Global error handler 
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err.message);

  const statusCode =
    err.message === "Email already exists" ? 409
    : err.message === "No account found with this email" ? 404
    : err.message === "Incorrect password" ? 401
    : err.message === "Invalid credentials" ? 401
    : err.message === "User not found" ? 404
    : err.message === "Unauthorized" ? 401
    : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;