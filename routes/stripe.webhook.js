// import express from "express";
// import stripe from "../config/stripe.js";
// import OrderService from "../services/order.service.js";

// const router = express.Router();

// router.post(
//     "/stripe/webhook",
//     express.raw({ type: "application/json" }),
//     (req, res) => {
//         const sig = req.headers["stripe-signature"];

//         let event;
//         try {
//             event = stripe.webhooks.constructEvent(
//                 req.body,
//                 sig,
//                 process.env.STRIPE_WEBHOOK_SECRET
//             );
//         } catch (err) {
//             return res.status(400).send(`Webhook Error: ${err.message}`);
//         }

//         if (event.type === "checkout.session.completed") {
//             const session = event.data.object;
//             const orderId = session.metadata.orderId;

//             OrderService.updateStatus(orderId, "PAID");
//         }

//         res.json({ received: true });
//     }
// );

// export default router;
