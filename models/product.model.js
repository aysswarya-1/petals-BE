import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    public_id: { type: String, required: true } // For Cloudinary
});

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Product title is required"],
            trim: true
        },
        description: {
            type: String,
            required: [true, "Product description is required"]
        },
        category: {
            type: String,
            required: true,
            enum: ["bouquets", "arrangements", "occasions", "decor", "hampers", "plants", "custom"]
        },
        price: {
            type: Number,
            required: [true, "Product price is required"]
        },
        salePrice: {
            type: Number,
            default: null
        },
        colors: {
            type: [String],
            default: []
        },
        size: {
            type: String,
            enum: ["classic", "deluxe", "lux", "grand"],
            default: "classic"
        },
        deliveryOptions: {
            type: [String],
            enum: ["same-day", "next-day", "scheduled", "pickup"],
            default: ["same-day"]
        },
        tags: {
            type: [String],
            default: []
        },
        stock: {
            type: Number,
            default: 10
        },
        isFeatured: {
            type: Boolean,
            default: false
        },
        isNewArrival: {
            type: Boolean,
            default: false
        },
        images: [imageSchema]
    },
    { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
