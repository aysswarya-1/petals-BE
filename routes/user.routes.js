import express from "express";
import UserController from "../controllers/user.controller.js";
import { protect, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.put("/address", protect, UserController.updateAddress);

// Admin only
router.get("/", protect, isAdmin, UserController.getUsers);
router.put("/:id", protect, isAdmin, UserController.updateUserRole);
router.delete("/:id", protect, isAdmin, UserController.deleteUser);

router.get("/dashboard", protect, UserController.getUserDashboard);

export default router;
