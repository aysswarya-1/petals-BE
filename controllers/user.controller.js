import asyncHandler from "../middlewares/asyncHandler.js";
import DashboardService from "../services/Dashboard.service.js";
import UserService from "../services/user.service.js";

class UserController {
    getUsers = asyncHandler(async (req, res) => {
        const users = await UserService.getAllUsers();
        res.json(users);
    });

    updateUserRole = asyncHandler(async (req, res) => {
        const { role } = req.body;

        if (!role) {
            res.status(400);
            throw new Error("Role is required");
        }

        const user = await UserService.updateRole(req.params.id, role);
        res.json(user);
    });

    deleteUser = asyncHandler(async (req, res) => {
        await UserService.deleteUser(req.params.id);
        res.json({ message: "User deleted successfully" });
    });

    updateAddress = asyncHandler(async (req, res) => {
        const updatedUser = await UserService.updateAddress(
            req.user.id,
            req.body
        );

        res.json({
            message: "Address updated successfully",
            address: updatedUser.address,
        });
    })

    getUserDashboard = asyncHandler(async (req, res) => {
        const userId = req.user.id;
        const [stats, sales, recentOrders] = await Promise.all([
            DashboardService.getStats(userId),
            DashboardService.getSalesLast7Days(userId),
            DashboardService.getRecentOrders(userId, 3)
        ]);

        res.status(200).json({
            stats,
            sales,
            recentOrders
        });
    });

}

export default new UserController();
