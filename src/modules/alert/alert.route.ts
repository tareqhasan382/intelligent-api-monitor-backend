import express from "express";
import auth from "../../middleware/auth.middleware";
import alertController from "./alert.controller";

const router = express.Router();

router.get("/", auth, alertController.getAllAlerts);
router.get("/:id", auth, alertController.getAlertById);
router.patch("/:id/resolve", auth, alertController.resolveAlert);

export default router;
