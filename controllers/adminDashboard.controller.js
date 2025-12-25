import asyncHandler from "../middlewares/asyncHandler.js";
import DashboardService from "../services/Dashboard.service.js";

export const getAdminDashboard = asyncHandler(async (req, res) => {
    const [stats, sales, recentOrders] = await Promise.all([
        DashboardService.getStats(),
        DashboardService.getSalesLast7Days(),
        DashboardService.getRecentOrders(),
    ]);

    res.status(200).json({
        stats,
        sales,
        recentOrders,
    });
});
