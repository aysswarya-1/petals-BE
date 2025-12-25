import express from "express";
import OrderController from "../controllers/order.controller.js";
import { protect, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Customer
router.post("/stripe", protect, OrderController.createStripeSession);
router.post("/cod", protect, OrderController.createCOD);
router.get("/my", protect, OrderController.getMyOrders);

// Admin
router.get("/admin/all", protect, isAdmin, OrderController.adminGetAll);
router.patch("/admin/status/:id", protect, isAdmin, OrderController.updateStatus);

// Stripe (later)
// router.post("/stripe", protect, OrderController.createStripeOrder);

export default router;
