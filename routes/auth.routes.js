import express from "express"
import AuthController from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/profile", protect, AuthController.profile);
router.put("/change-password", protect, AuthController.changePassword);
router.get("/refresh", AuthController.refresh);
router.post("/logout", protect, AuthController.logout);

export default router;