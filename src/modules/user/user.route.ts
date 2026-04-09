import express from "express";
import auth from "../../middleware/auth.middleware";
import userController from "./user.controller";
import validateRequest from "../../middleware/validateRequest";
import { userIdParamSchema } from "./user.validation";

const router = express.Router();

router.get("/me", auth, userController.getMe);
router.get("/:id", auth, validateRequest(userIdParamSchema), userController.getUserById);

export default router;
