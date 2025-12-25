import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/product.model.js";
import { sampleProducts } from "./sampleProducts.js"; // your 24 products array
import { connectDB } from "../config/db.js";

dotenv.config();

// Transform sampleProducts to match Product model
const transformProducts = (products) =>
    products.map((p) => ({
        title: p.title,
        description: p.description,
        price: p.price,
        salePrice: p.salePrice || null,
        category: p.category,
        colors: p.colors || [],
        size: p.size || "classic",
        deliveryOptions: p.delivery ? [p.delivery] : ["same-day"],
        tags: p.tag ? [p.tag] : [],
        stock: p.stock || 10,
        isFeatured: p.isFeatured || false,
        isNewArrival: p.isNewArrival || false,
        images: p.images
            ? p.images.map((img, idx) => ({
                url: typeof img === "string" ? img : img.url,
                public_id: typeof img === "string"
                    ? `seed/${p.title.toLowerCase().replace(/\s+/g, "-")}-${idx + 1}`
                    : img.public_id || `seed/${p.title.toLowerCase().replace(/\s+/g, "-")}-${idx + 1}`,
            }))
            : [],
    }));

const seedProducts = async () => {
    try {
        await connectDB();
        await Product.deleteMany(); // clear existing products
        const transformed = transformProducts(sampleProducts);
        await Product.insertMany(transformed);
        console.log("Products seeded successfully!");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedProducts();
