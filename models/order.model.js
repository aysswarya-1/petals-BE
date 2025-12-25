import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            unique: true,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
            },
        ],

        total: {
            type: Number,
            required: true,
        },

        paymentMethod: {
            type: String,
            enum: ["COD", "STRIPE"],
            default: "COD",
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },

        orderStatus: {
            type: String,
            enum: ["processing", "confirmed", "shipped", "delivered", "cancelled"],
            default: "processing",
        },
    },
    { timestamps: true }
);

// Auto-generate unique order number
orderSchema.pre("save", async function () {
    if (!this.orderNumber) {
        const shortId = this._id.toString().slice(-6).toUpperCase();
        this.orderNumber = `ORD-${shortId}`;
    }
});

export default mongoose.model("Order", orderSchema);
