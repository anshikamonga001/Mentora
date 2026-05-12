import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/* ============================
  AUTH MIDDLEWARE (ESM)
============================ */
export const auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    // ✅ FIX: correct secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // No admin approval required — allow all verified users to proceed

    // Attach a compact `req.user` with `userId` (used across routes)
    // and keep the full user document on `req.userDoc` for handlers
    req.user = { userId: user._id, role: user.role };
    req.userDoc = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

/* ============================
   ROLE-BASED AUTH
============================ */
export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  }
  next();
};

export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }
  next();
};

export const approvedOnly = (req, res, next) => {
  // Previously enforced admin approval; now allow all authenticated users.
  return next();
};
