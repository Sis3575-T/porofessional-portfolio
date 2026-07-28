import express from "express";
import bcrypt from "bcryptjs";
import { generateToken, authenticateToken, prisma } from "shared";

const router = express.Router();

async function logActivity(userId, action, entity, entityId) {
  try {
    await prisma.activity.create({
      data: { userId, action, entity, entityId },
    });
  } catch (err) {
    console.error("Activity logging failed (non-critical):", err.message);
  }
}

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    let user;
    try {
      user = await prisma.user.findUnique({ where: { email } });
    } catch (dbError) {
      console.error("Database query failed:", dbError.message);
      return res.status(500).json({
        success: false,
        message: "Database connection failed. Please try again later.",
      });
    }

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account disabled. Contact administrator.",
      });
    }

    let isPasswordValid;
    try {
      isPasswordValid = await bcrypt.compare(password, user.password);
    } catch (bcryptError) {
      console.error("Password comparison failed:", bcryptError.message);
      return res.status(500).json({
        success: false,
        message: "Authentication error. Please try again.",
      });
    }

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    try {
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });
    } catch (updateError) {
      console.error("Failed to update lastLogin:", updateError.message);
    }

    logActivity(user.id, "LOGIN", "User", user.id);

    const token = generateToken(user.id, user.email, user.role);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Login failed" });
  }
});

router.post("/logout", authenticateToken, async (req, res) => {
  try {
    logActivity(req.userId, "LOGOUT", "User", req.userId);
    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Logout failed" });
  }
});

router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, role: true, isActive: true, lastLogin: true, createdAt: true },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error("Failed to fetch user:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
});

export default router;
