import express from 'express';
import { sendEmail } from '../utils/sendEmail.js';

const router = express.Router();

/**
 * POST /api/subscribe
 * Sends a notification email to admin when someone subscribes
 */
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Valid email is required' });
    }

    // Send notification to admin
    await sendEmail({
      email: process.env.EMAIL_USER, // sends to anshikamonga37@gmail.com
      subject: '📬 New Newsletter Subscriber — Mentora',
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:auto;background:#f8fafc;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
          <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:28px 32px;">
            <h1 style="color:white;margin:0;font-size:22px;">📬 New Subscriber!</h1>
            <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:14px;">Someone just subscribed to the Mentora newsletter</p>
          </div>
          <div style="padding:28px 32px;">
            <p style="color:#374151;font-size:15px;margin:0 0 16px;">A new user has subscribed to the Mentora newsletter:</p>
            <div style="background:#ede9fe;border-radius:8px;padding:14px 18px;display:inline-block;">
              <strong style="color:#4f46e5;font-size:16px;">📧 ${email}</strong>
            </div>
            <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;"/>
            <p style="color:#6b7280;font-size:13px;margin:0;">
              This is an automated notification from the Mentora platform.<br/>
              Keep growing your subscriber base! 🚀
            </p>
          </div>
        </div>
      `,
    });

    // Also send a welcome confirmation to the subscriber
    await sendEmail({
      email,
      subject: '🎉 Welcome to Mentora Newsletter!',
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:auto;background:#f8fafc;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
          <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:28px 32px;">
            <h1 style="color:white;margin:0;font-size:22px;">🎉 You're subscribed!</h1>
            <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:14px;">Welcome to the Mentora community</p>
          </div>
          <div style="padding:28px 32px;">
            <p style="color:#374151;font-size:15px;margin:0 0 12px;">Hi there! 👋</p>
            <p style="color:#374151;font-size:15px;margin:0 0 20px;">
              Thank you for subscribing to the <strong>Mentora Newsletter</strong>. 
              You'll now receive updates on new tutors, sessions, freelance projects, and platform news.
            </p>
            <a href="http://localhost:3000" 
               style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">
              Visit Mentora →
            </a>
            <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;"/>
            <p style="color:#9ca3af;font-size:12px;margin:0;">
              You subscribed with ${email}. To unsubscribe, contact support@mentora.com
            </p>
          </div>
        </div>
      `,
    });

    res.json({ success: true, message: 'Subscribed successfully!' });

  } catch (err) {
    console.error('Subscribe error:', err);
    res.status(500).json({ success: false, message: 'Failed to subscribe' });
  }
});

export default router;
