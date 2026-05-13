import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// ROUTES
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import doubtRoutes from "./routes/doubts.js";
import mentorRoutes from "./routes/mentors.js";
import freelanceRoutes from "./routes/freelance.js";
import adminRoutes from "./routes/admin.js";
import sessionRoutes from "./routes/sessions.js";
import googleRoutes from "./routes/google.js";
import notificationRoutes from "./routes/notifications.js";
import subscribeRoutes from "./routes/subscribe.js";

// ================================
// FIX __dirname FOR ESM
// ================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================================
// ENV
// ================================
dotenv.config({ path: path.join(__dirname, "../.env") });

// ================================
// INIT
// ================================
const app = express();

// ================================
// SECURITY
// ================================
app.use(helmet());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

// ================================
// CORS
// ================================
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// ================================
// BODY
// ================================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ================================
// DB
// ================================
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error(err));

// ================================
// ROUTES
// ================================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/doubts", doubtRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/freelance", freelanceRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/google", googleRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/subscribe", subscribeRoutes);

// ================================
// HEALTH
// ================================
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

// ================================
// START
// ================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
