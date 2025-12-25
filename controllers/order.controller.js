import asyncHandler from "../middlewares/asyncHandler.js";
import OrderService from "../services/order.service.js";
import StripeService from "../services/stripe.service.js";

class OrderController {
    createCOD = asyncHandler(async (req, res) => {
        const { items, totalAmount } = req.body;

        if (!items || items.length === 0) {
            res.status(400);
            throw new Error("No order items");
        }
        console.log("req.user:", req.user);
        if (!req.user) {
            res.status(401);
            throw new Error("User not authenticated");
        }

        const orderData = {
            user: req.user._id,
            items: items.map(item => ({
                product: item._id,
                quantity: item.qty,
                price: item.price,
            })),
            total: totalAmount,
            paymentMethod: "COD",
            paymentStatus: "pending",
        };

        const order = await OrderService.create(orderData);
        res.status(201).json({ success: true, order });
    });

    getMyOrders = asyncHandler(async (req, res) => {
        const orders = await OrderService.getMyOrders(req.user._id);
        res.json({ success: true, orders });
    });

    adminGetAll = asyncHandler(async (req, res) => {
        const orders = await OrderService.adminGetAll();
        res.json({ success: true, orders });
    });

    updateStatus = asyncHandler(async (req, res) => {
        const { type, status } = req.body;

        if (!["order", "payment"].includes(type)) {
            res.status(400);
            throw new Error("Invalid status type");
        }

        const updated = await OrderService.updateStatus(
            req.params.id,
            type,
            status
        );

        res.json({
            success: true,
            order: updated,
        });
    })

    createStripeSession = asyncHandler(async (req, res) => {
        const { items } = req.body;

        if (!req.user) {
            res.status(401);
            throw new Error("User not authenticated");
        }

        const total = items.reduce(
            (sum, i) => sum + i.price * i.qty,
            0
        );

        const order = await OrderService.create({
            user: req.user._id,
            items: items.map(item => ({
                product: item._id,
                quantity: item.qty,
                price: item.price,
            })),
            total,
            paymentMethod: "STRIPE",
            paymentStatus: "pending",
        });

        const session = await StripeService.createCheckoutSession({
            items,
            userId: req.user.id,
            orderId: order._id.toString(),
        });

        res.json({
            url: session.url,
        });
    });

}

export default new OrderController();
