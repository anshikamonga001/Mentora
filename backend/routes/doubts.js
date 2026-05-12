import express from "express";
import Doubt from "../models/Doubts.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

/* ===================== GET ALL DOUBTS ===================== */
router.get("/", auth, async (req, res) => {
  try {
    const doubts = await Doubt.find()
      .populate("askedBy", "name role")
      .populate("answers.answeredBy", "name role")
      .sort({ createdAt: -1 });

    res.json({ success: true, doubts });
  } catch (err) {
    console.error("GET DOUBTS ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to load doubts" });
  }
});


/* ===================== POST DOUBT ===================== */
router.post("/", auth, async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: "Title and content are required" });
    }

    const doubt = await Doubt.create({
      title,
      content,
      tags: tags || [],
      askedBy: req.user.userId,
    });

    // 🔔 Notify all tutors about the new question
    try {
      const tutors = await User.find({ role: "tutor" }).select("_id");
      if (tutors.length > 0) {
        const notifications = tutors.map((tutor) => ({
          recipient: tutor._id,
          sender: req.user.userId,
          type: "new_question",
          message: `New question posted: "${title.substring(0, 60)}${title.length > 60 ? '...' : ''}"`,
          link: "/answer-zone",
        }));
        await Notification.insertMany(notifications);
      }
    } catch (notifErr) {
      console.error("NOTIFICATION ERROR (non-fatal):", notifErr);
    }

    res.status(201).json({ success: true, doubt });
  } catch (err) {
    console.error("POST DOUBT ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to post doubt" });
  }
});

/* ===================== POST ANSWER TO DOUBT ===================== */
router.post('/:id/answer', auth, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Answer content required' });
    }

    if (req.user.role !== 'tutor') {
      return res.status(403).json({ success: false, message: 'Only tutors can post answers' });
    }

    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) {
      return res.status(404).json({ success: false, message: 'Doubt not found' });
    }

    const answer = { content: content.trim(), answeredBy: req.user.userId };
    doubt.answers.push(answer);
    await doubt.save();

    // 🔔 Notify the student who asked the question
    try {
      if (String(doubt.askedBy) !== String(req.user.userId)) {
        const tutor = await User.findById(req.user.userId).select("name");
        await Notification.create({
          recipient: doubt.askedBy,
          sender: req.user.userId,
          type: "new_answer",
          message: `${tutor?.name || 'A tutor'} answered your question: "${doubt.title.substring(0, 50)}${doubt.title.length > 50 ? '...' : ''}"`,
          link: "/ask-zone",
        });
      }
    } catch (notifErr) {
      console.error("NOTIFICATION ERROR (non-fatal):", notifErr);
    }

    res.json({ success: true, message: 'Answer posted successfully' });
  } catch (err) {
    console.error('POST ANSWER ERROR:', err);
    res.status(500).json({ success: false, message: 'Failed to post answer' });
  }
});

export default router;
