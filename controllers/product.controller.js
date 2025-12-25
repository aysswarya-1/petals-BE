import asyncHandler from "../middlewares/asyncHandler.js";
import ProductService from "../services/product.service.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";

class ProductController {
    // CREATE product
    create = asyncHandler(async (req, res) => {
        const {
            title,
            description,
            price,
            salePrice,
            category,
            size,
            isFeatured,
            isNewArrival,
        } = req.body;

        // Parse arrays (FormData sends strings)
        const colors = Array.isArray(req.body["colors[]"])
            ? req.body["colors[]"]
            : req.body["colors[]"]
                ? [req.body["colors[]"]]
                : [];

        const deliveryOptions = Array.isArray(req.body["deliveryOptions[]"])
            ? req.body["deliveryOptions[]"]
            : req.body["deliveryOptions[]"]
                ? [req.body["deliveryOptions[]"]]
                : [];

        if (!req.files || req.files.length === 0) {
            res.status(400);
            throw new Error("At least one image is required");
        }

        // ⬆️ Upload to Cloudinary
        const images = await Promise.all(
            req.files.map(async (file) => {
                const uploaded = await uploadToCloudinary(file.buffer, "products");
                return {
                    url: uploaded.secure_url,
                    public_id: uploaded.public_id, // ✅ FIXED
                };
            })
        );

        const product = await ProductService.createProduct({
            title,
            description,
            price: Number(price),
            salePrice: Number(salePrice || 0),
            category,
            size,
            colors,
            deliveryOptions,
            isFeatured: isFeatured === "true",
            isNewArrival: isNewArrival === "true",
            images,
        });

        res.status(201).json({
            success: true,
            product,
        });
    });


    // GET all products
    getAll = asyncHandler(async (req, res) => {
        const products = await ProductService.getProducts(req.query);
        res.status(200).json(products);
    });

    // GET one
    getOne = asyncHandler(async (req, res) => {
        const product = await ProductService.getProductById(req.params.id);
        if (!product) {
            res.status(404)
            throw new Error("Product not found")
        }
        res.json(product);
    });

    // UPDATE
    update = asyncHandler(async (req, res) => {
        const productId = req.params.id;

        const updatedProduct = await ProductService.updateProduct(
            productId,
            req.body,
            req.files
        );

        if (!updatedProduct) {
            res.status(404);
            throw new Error("Product not found");
        }

        res.json({
            success: true,
            product: updatedProduct,
        });
    });

    // DELETE
    delete = asyncHandler(async (req, res) => {
        const deleted = await ProductService.deleteProduct(req.params.id);
        if (!deleted) {
            res.status(404)
            throw new Error("Product not found")
        }
        res.json({ message: "Product deleted successfully" });
    });
}

export default new ProductController();