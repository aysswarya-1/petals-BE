import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema({
    type: { type: String, enum: ["contact", "consultation"], required: true },
    firstName: String,
    lastName: String,
    fullName: String,
    email: { type: String, required: true },
    phone: String,
    inquiryPurpose: String,
    preferredDate: Date,
    message: String,
    eventDate: Date,
    guestCount: Number,
    venue: String,
    city: String,
    budgetRange: String,
    vision: String,
    pinterestLink: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", default: null },
    // orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", default: null },
    status: { type: String, enum: ["pending", "reviewing", "resolved"], default: "pending" }
}, { timestamps: true });


export default mongoose.model("Inquiry", inquirySchema);
