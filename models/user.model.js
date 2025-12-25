import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const addressSchema = new mongoose.Schema(
    {
        fullName: { type: String, default: "" },
        phone: { type: String, default: "" },
        street: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        postalCode: { type: String, default: "" },
        country: { type: String, default: "" },
    },
    { _id: false }
);

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        default: "",
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false
    },
    phone: {
        type: String,
        default: "",
    },
    event: {
        type: String,
        default: "",
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    refreshToken: {
        type: String,
        default: "",
    },
    address: addressSchema,
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
    ],

},
    { timestamps: true });

// Hash password before saving
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10)
})

// compare password for login
userSchema.methods.matchPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
}

export default mongoose.model("User", userSchema)