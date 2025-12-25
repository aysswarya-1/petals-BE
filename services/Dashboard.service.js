import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Inquiry from "../models/inquiry.model.js";
import mongoose from "mongoose";

class DashboardService {

    /* ======================
       STATS (Admin / User)
    ====================== */
    async getStats(userId = null) {

        // 👤 USER DASHBOARD
        if (userId) {
            const uid = new mongoose.Types.ObjectId(userId);

            const [ordersAgg] = await Order.aggregate([
                { $match: { user: uid } },
                {
                    $group: {
                        _id: null,
                        orders: { $sum: 1 },
                        pendingOrders: {
                            $sum: {
                                $cond: [{ $eq: ["$orderStatus", "processing"] }, 1, 0]
                            }
                        },
                        totalSpent: { $sum: "$total" }
                    }
                }
            ]);

            const wishlistCount = await User.aggregate([
                { $match: { _id: uid } },
                {
                    $project: {
                        wishlistCount: { $size: { $ifNull: ["$wishlist", []] } }
                    }
                }
            ]);

            return {
                orders: ordersAgg?.orders || 0,
                pendingOrders: ordersAgg?.pendingOrders || 0,
                wishlist: wishlistCount[0]?.wishlistCount || 0,
                totalSpent: ordersAgg?.totalSpent || 0
            };
        }

        // 🛠 ADMIN DASHBOARD
        const [users, products, orders, inquiries] = await Promise.all([
            User.countDocuments(),
            Product.countDocuments(),
            Order.countDocuments(),
            Inquiry.countDocuments({ status: "pending" }),
        ]);

        const wishlistAgg = await User.aggregate([
            {
                $project: {
                    wishlistCount: {
                        $size: { $ifNull: ["$wishlist", []] }
                    }
                }
            },
            {
                $group: { _id: null, total: { $sum: "$wishlistCount" } }
            }
        ]);

        const revenueAgg = await Order.aggregate([
            { $match: { paymentStatus: "paid" } },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$total" },
                },
            },
        ]);

        return {
            users,
            products,
            orders,
            wishlist: wishlistAgg[0]?.total || 0,
            revenue: revenueAgg[0]?.total || 0,
            openInquiries: inquiries,
        };
    }

    /* ======================
       SALES CHART (Admin / User)
    ====================== */
    async getSalesLast7Days(userId = null) {
        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate() - 6);

        const match = {
            paymentStatus: "paid",
            createdAt: { $gte: last7Days },
        };

        if (userId) {
            match.user = new mongoose.Types.ObjectId(userId);
        }

        return await Order.aggregate([
            { $match: match },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt",
                        },
                    },
                    orders: { $sum: 1 },
                    revenue: { $sum: "$total" },
                },
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    _id: 0,
                    day: "$_id",
                    orders: 1,
                    revenue: 1,
                },
            },
        ]);
    }

    /* ======================
       RECENT ORDERS (Admin ONLY)
    ====================== */
    async getRecentOrders(userId = null, limit = 5) {
        const filter = {};

        if (userId) {
            filter.user = new mongoose.Types.ObjectId(userId);
        }

        return await Order.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate("items.product", "name images")
            .populate("user", "firstName lastName email");
    }

}

export default new DashboardService();
