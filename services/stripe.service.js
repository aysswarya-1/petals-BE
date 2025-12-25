import stripe from "../config/stripe.js";

class StripeService {
    async createCheckoutSession({ items, userId, orderId, userEmail }) {
        const lineItems = items.map(item => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.title,
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.qty,
        }));

        return await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: lineItems,
            success_url: `${process.env.CLIENT_URL}/checkout/success?orderId=${orderId}`,
            cancel_url: `${process.env.CLIENT_URL}/checkout/cancel`,
        });

    }
}

export default new StripeService();
