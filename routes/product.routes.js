import express from "express"
import ProductController from "../controllers/product.controller.js"
import { protect, isAdmin } from "../middlewares/auth.middleware.js";
import multer from "multer"

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() });

// PUBLIC ROUTES
router.get("/products", ProductController.getAll);
router.get("/products/:id", ProductController.getOne);

// ADMIN ROUTES
router.post("/products", protect, isAdmin, upload.array("images", 4), ProductController.create);
router.put("/products/:id", protect, isAdmin, upload.array("images", 4), ProductController.update);
router.delete("/products/:id", protect, isAdmin, ProductController.delete);

export default router;