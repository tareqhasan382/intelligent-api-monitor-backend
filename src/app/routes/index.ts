import express from "express";
import authRoutes from "../../modules/auth/auth.route";
import userRoutes from "../../modules/user/user.route";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);

export const RouterV1 = router;
export default router;


