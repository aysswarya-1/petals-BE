import AuthService from "../services/auth.service.js";

class AuthController {
    async register(req, res) {
        try {
            const { user, accessToken, refreshToken } = await AuthService.register(req.body);
            const isProd = process.env.NODE_ENV === "production";

            res.cookie("Token", refreshToken, {
                httpOnly: true,
                secure: isProd,
                sameSite: isProd ? "none" : "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.status(201).json({
                accessToken,
                user: { id: user._id, role: user.role, email: user.email },
            });

        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async login(req, res) {
        try {
            const { user, accessToken, refreshToken } = await AuthService.login(req.body);

            res.cookie("Token", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.status(201).json({
                accessToken,
                user: { id: user._id, role: user.role, email: user.email },
            });

        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async refresh(req, res) {
        try {
            const token = req.cookies?.Token;

            const { accessToken, refreshToken, user } = await AuthService.refresh(token);

            // Set new refresh token
            res.cookie("Token", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.status(200).json({
                accessToken,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                }
            });

        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async logout(req, res) {
        try {
            await AuthService.logout(req.user.id);

            res.clearCookie("Token")
            res.json({ message: "Logged out" });

        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async profile(req, res) {
        try {
            const user = await AuthService.profile(req.user.id);
            res.json(user);

        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    }

    async changePassword(req, res) {
        try {
            const user = await AuthService.profile(req.user.id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                });
            }

            res.json({
                success: true,
                user,
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message: error.message || "Unauthorized",
            });
        }
    };

}

export default new AuthController();