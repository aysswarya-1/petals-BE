import cloudinary from "../config/cloudinary.js";
import Product from "../models/product.model.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import { parseArray } from "../utils/parseArray.js";

class ProductService {
    async createProduct(data) {
        return await Product.create(data);
    }

    async getProducts(query) {
        const filters = {}

        // filtering
        if (query.category) filters.category = query.category;
        if (query.size) filters.size = query.size;
        if (query.colors) filters.colors = { $in: query.colors.split(",") };
        if (query.minPrice && query.maxPrice) {
            filters.price = { $gte: query.minPrice, $lte: query.maxPrice };
        }

        return await Product.find(filters).sort({ createdAt: -1 })
    }

    async getProductById(id) {
        return await Product.findById(id);
    }

    async updateProduct(productId, body, files) {
        const product = await Product.findById(productId);
        if (!product) return null;

        const colors = parseArray(body.colors);
        const deliveryOptions = parseArray(body.deliveryOptions);

        const hasImageUpdate =
            body["existingImages[]"] !== undefined || (files && files.length > 0);

        // 🔒 ONLY TOUCH IMAGES IF USER UPDATED THEM
        if (hasImageUpdate) {
            const existingImages = parseArray(body["existingImages[]"]);

            // Delete removed images
            const imagesToDelete = product.images.filter(
                img => !existingImages.includes(img.url)
            );

            for (const img of imagesToDelete) {
                if (img.public_id) {
                    await cloudinary.uploader.destroy(img.public_id);
                }
            }

            // Upload new images
            let newImages = [];
            if (files?.length) {
                newImages = await Promise.all(
                    files.map(async (file) => {
                        const uploaded = await uploadToCloudinary(
                            file.buffer,
                            "products"
                        );
                        return {
                            url: uploaded.secure_url,
                            public_id: uploaded.public_id,
                        };
                    })
                );
            }

            const keptImages = product.images.filter(img =>
                existingImages.includes(img.url)
            );

            product.images = [...keptImages, ...newImages];
        }

        // ✅ Safe field updates
        product.title = body.title;
        product.description = body.description;
        product.price = Number(body.price);
        product.salePrice = Number(body.salePrice || 0);
        product.category = body.category;
        product.size = body.size;
        product.colors = colors;
        product.deliveryOptions = deliveryOptions;
        product.isFeatured = body.isFeatured === "true";
        product.isNewArrival = body.isNewArrival === "true";

        await product.save();
        return product;
    }

    async deleteProduct(id) {
        return await Product.findByIdAndDelete(id);
    }
}

export default new ProductService();