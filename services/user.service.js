// services/user.service.js
import User from "../models/user.model.js";

class UserService {
    getAllUsers() {
        return User.find().select("-password -refreshToken");
    }

    updateRole(id, role) {
        return User.findByIdAndUpdate(
            id,
            { role },
            { new: true }
        ).select("-password -refreshToken");
    }

    deleteUser(id) {
        return User.findByIdAndDelete(id);
    }

    async updateAddress(userId, addressData = {}) {
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        // ✅ update phone if exists
        if (addressData.phone !== undefined) {
            user.phone = addressData.phone;
        }
        const fullName = `${user.firstName} ${user.lastName || ""}`.trim();
        // ✅ ensure address object exists
        user.address = {
            fullName,
            phone: addressData.phone || user.phone,
            street: addressData.street || "",
            city: addressData.city || "",
            state: addressData.state || "",
            postalCode: addressData.postalCode || "",
            country: addressData.country || "",
        };

        return await user.save();
    }

}

export default new UserService();
