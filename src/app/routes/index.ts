import express from "express";
import authRoutes from "../../modules/auth/auth.route";
import userRoutes from "../../modules/user/user.route";
import monitorRoutes from "../../modules/monitor/monitor.route";
import alertRoutes from "../../modules/alert/alert.route";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/monitor", monitorRoutes);
router.use("/alerts", alertRoutes);

export const RouterV1 = router;
export default router;
