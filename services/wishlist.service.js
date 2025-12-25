import User from "../models/user.model.js";

class WishlistService {
    // ✅ Get logged-in user's wishlist
    async getMyWishlist(userId) {
        const user = await User.findById(userId)
            .populate("wishlist");

        if (!user) throw new Error("User not found");

        return user.wishlist;
    }

    // ✅ Add / Remove (toggle) product
    async toggleWishlist(userId, productId) {
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        const index = user.wishlist.findIndex(
            (id) => id.toString() === productId
        );

        if (index > -1) {
            // Remove
            user.wishlist.splice(index, 1);
        } else {
            // Add
            user.wishlist.push(productId);
        }

        await user.save();
        return user.wishlist;
    }

    // ✅ Admin – get all wishlists
    async getAllWishlists() {
        return await User.find({ wishlist: { $ne: [] } })
            .select("firstName lastName email wishlist")
            .populate("wishlist");
    }
}

export default new WishlistService();
