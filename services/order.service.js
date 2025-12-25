import Order from "../models/order.model.js";

class OrderService {
    async create(data) {
        return await Order.create(data);
    }

    async getMyOrders(userId) {
        return await Order.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate("items.product", "title price images");
    }

    async adminGetAll() {
        return await Order.find()
            .sort({ createdAt: -1 })
            .populate("user", "firstName lastName email")
            .populate("items.product", "title price images");
    }

    async updateStatus(orderId, type, status) {
        const updateField =
            type === "payment" ? "paymentStatus" : "orderStatus";

        return await Order.findByIdAndUpdate(
            orderId,
            { [updateField]: status },
            { new: true, runValidators: true }
        );
    }
}

export default new OrderService();
