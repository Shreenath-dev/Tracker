import { decodeToken } from "@/security/jwt";
import { Tokens, User } from "@/models";

export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ status: "false", message: "Unauthorized" });
        }

        const decoded = decodeToken(authHeader, "access");

        if (!decoded || !decoded.id || !decoded.sessionId) {
            return res.status(401).json({ status: "false", message: "Invalid or expired token" });
        }

        const tokenRecord = await Tokens.findOne({
            clientId: decoded.id,
            sessionId: decoded.sessionId,
            accessToken: authHeader,
        });

        if (!tokenRecord) {
            return res.status(401).json({ status: "false", message: "Session not found" });
        }

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ status: "false", message: "User not found" });
        }

        req.user = user;
        req.token = authHeader;
        next();
    } catch (error) {
        return res.status(500).json({ status: "false", message: "Internal server error", error: error.message });
    }
};
