import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.routes.js'
import productRoutes from './routes/product.routes.js'
import inquiryRoutes from './routes/inquiry.routes.js'
import orderRoutes from './routes/order.routes.js'
import userRoutes from './routes/user.routes.js'
import wishlistRoutes from './routes/wishlist.route.js'
// import stripeWebhookRoutes from './routes/stripe.webhook.js'
import adminDashboardRoutes from "./routes/adminDashboard.routes.js";
import { connectDB } from './config/db.js'

const PORT = process.env.PORT || 5000
const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(cookieParser())
// app.use('/api/stripe-webhook', express.raw({ type: 'application/json' }), stripeWebhookRoutes);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", productRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/admin", adminDashboardRoutes);

connectDB();

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`)
})

