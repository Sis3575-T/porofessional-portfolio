// services/api/src/middleware/auth.js
import { verifyToken } from "../utils/jwt.js";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token required",
    });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }

  req.userId = decoded.userId;
  req.email = decoded.email;
  req.role = decoded.role;

  next();
};

export const requireAdmin = (req, res, next) => {
  if (req.role !== "ADMIN" && req.role !== "EDITOR") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }
  next();
};
