import WishlistService from "../services/wishlist.service.js";

class WishlistController {
    // USER – Get my wishlist
    async myWishlist(req, res) {
        try {
            const wishlist = await WishlistService.getMyWishlist(req.user.id);
            res.json(wishlist);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    // USER – Toggle wishlist
    async toggle(req, res) {
        try {
            const wishlist = await WishlistService.toggleWishlist(
                req.user.id,
                req.params.productId
            );

            res.json({
                message: "Wishlist updated",
                wishlist,
            });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    // ADMIN – View all wishlists
    async adminWishlists(req, res) {
        try {
            const data = await WishlistService.getAllWishlists();
            res.json(data);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

export default new WishlistController();
