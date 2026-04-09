import express from "express";
import auth from "../../middleware/auth.middleware";
import monitorController from "./monitor.controller";
import validateRequest from "../../middleware/validateRequest";
import { monitorInputSchema } from "./monitor.validation";
import { upload } from "../../utils/multerUtils";

const router = express.Router();

router.post(
  "/",
  auth,
  upload.single("file"), // Support for file uploads (JSON/CSV)
  // Optional: Add manual validation for JSON body if not using file
  // validateRequest(monitorInputSchema), 
  monitorController.monitor
);

export default router;
