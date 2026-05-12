import express from "express";
import User from "../models/User.js";
import Session from "../models/Session.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/mentors
// @desc    Get all mentors and their active sessions
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const mentors = await User.find({ role: "tutor" }).select(
      "name title bio avatar hourlyRate skills location"
    );

    // For each mentor, fetch active sessions
    const mentorData = await Promise.all(
      mentors.map(async (m) => {
        const sessions = await Session.find({
          mentor: m._id,
          date: { $gte: new Date() },
        }).sort({ date: 1 });

        return { mentor: m, sessions };
      })
    );

    res.json({ success: true, mentors: mentorData });
  } catch (error) {
    console.error("Get mentors error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
