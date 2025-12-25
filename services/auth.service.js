import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import User from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";

class AuthService {
    async register({ firstName, lastname = "", email, password, phone = "", event = "" }) {
        const exists = await User.findOne({ email });
        if (exists) throw new Error("Email already registered")

        const user = await User.create({ firstName, lastname, email, password, phone, event });

        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)

        user.refreshToken = refreshToken;
        await user.save();

        return { user, accessToken, refreshToken };
    }

    async login({ email, password }) {
        const user = await User.findOne({ email }).select("+password")
        if (!user) throw new Error("Invalid email or password")
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) throw new Error("Invalid email or password")

        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)

        user.refreshToken = refreshToken;
        await user.save();

        return { user, accessToken, refreshToken };
    }

    async refresh(refreshToken) {
        if (!refreshToken) throw new Error("No refresh token provided");

        let decoded;
        try {
            decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
        } catch (err) {
            if (err.name === "TokenExpiredError") throw new Error("Refresh token expired");
            throw new Error("Invalid refresh token");
        }

        const user = await User.findById(decoded.id);
        if (!user) throw new Error("User not found");

        if (user.refreshToken !== refreshToken) throw new Error("Refresh token mismatch");

        const accessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        user.refreshToken = newRefreshToken;
        await user.save();

        return { accessToken, refreshToken: newRefreshToken, user };
    }


    async logout(userId) {
        const user = await User.findById(userId)
        user.refreshToken = null;
        await user.save();
    }

    async profile(userId) {
        const user = await User
            .findById(userId)
            .select("-password")
            .lean()
        return user
    }

}

export default new AuthService()