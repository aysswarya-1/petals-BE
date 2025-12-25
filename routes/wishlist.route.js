import express from "express";
import WishlistController from "../controllers/wishlist.controller.js";
import { protect, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// USER
router.get("/", protect, WishlistController.myWishlist);
router.post("/:productId", protect, WishlistController.toggle);

// ADMIN
router.get("/admin/all", protect, isAdmin, WishlistController.adminWishlists);

export default router;
