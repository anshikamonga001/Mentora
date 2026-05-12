import express from "express";
import Notification from "../models/Notification.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get all notifications for logged-in user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.userId })
      .sort({ createdAt: -1 })
      .populate("sender", "name avatar");
      
    res.json({
      success: true,
      notifications,
    });
  } catch (err) {
    console.error("GET NOTIFICATIONS ERROR:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put("/:id/read", auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.userId },
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }
    
    res.json({ success: true, notification });
  } catch (err) {
    console.error("READ NOTIFICATION ERROR:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put("/read-all", auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.userId, read: false },
      { read: true }
    );
    res.json({ success: true, message: "All notifications marked as read" });
  } catch (err) {
    console.error("READ ALL NOTIFICATIONS ERROR:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

export default router;
