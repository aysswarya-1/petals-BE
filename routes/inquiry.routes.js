import express from "express"
import InquiryController from "../controllers/inquiry.controller.js"
import { protect, isAdmin } from "../middlewares/auth.middleware.js"

const router = express.Router()

// User creates inquiry
router.post("/", protect, InquiryController.create)

// User sees ONLY their inquiries
router.get("/my", protect, InquiryController.getMyInquiries)

// Admin routes
router.get("/admin/all", protect, isAdmin, InquiryController.adminGetAll)
router.put("/admin/status/:id", protect, isAdmin, InquiryController.updateStatus)

export default router;
