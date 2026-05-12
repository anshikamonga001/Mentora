import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { auth, authorize } from '../middleware/auth.js';
import { sendEmail } from '../utils/sendEmail.js';

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = req.userDoc;
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  auth,
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  body('college')
    .optional()
    .isLength({ max: 100 })
    .withMessage('College name cannot exceed 100 characters'),
  body('year')
    .optional()
    .isIn(['1st', '2nd', '3rd', '4th', 'Graduate', 'Other'])
    .withMessage('Invalid year specified'),
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  body('interests')
    .optional()
    .isArray()
    .withMessage('Interests must be an array')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const allowedUpdates = [
      'name', 'bio', 'college', 'year', 'branch', 'skills', 'interests',
      'socialLinks', 'preferences'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.userDoc._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/users/tutor-profile
// @desc    Update tutor profile
// @access  Private (Tutors only)
router.put('/tutor-profile', [
  auth,
  authorize('tutor'),
  body('expertise')
    .optional()
    .isArray()
    .withMessage('Expertise must be an array'),
  body('experience')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Experience cannot exceed 1000 characters'),
  body('hourlyRate')
    .optional()
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('Hourly rate must be a positive number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { expertise, experience, hourlyRate, availability } = req.body;

    const updateData = {};
    if (expertise) updateData['tutorProfile.expertise'] = expertise;
    if (experience) updateData['tutorProfile.experience'] = experience;
    if (hourlyRate !== undefined) updateData['tutorProfile.hourlyRate'] = hourlyRate;
    if (availability) updateData['tutorProfile.availability'] = availability;

    const user = await User.findByIdAndUpdate(
      req.userDoc._id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Tutor profile updated successfully',
      user
    });

  } catch (error) {
    console.error('Update tutor profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/users/freelancer-profile
// @desc    Update freelancer profile
// @access  Private (Freelancers only)
router.put('/freelancer-profile', [
  auth,
  authorize('freelancer'),
  body('portfolio')
    .optional()
    .isArray()
    .withMessage('Portfolio must be an array'),
  body('services')
    .optional()
    .isArray()
    .withMessage('Services must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { portfolio, services } = req.body;

    const updateData = {};
    if (portfolio) updateData['freelancerProfile.portfolio'] = portfolio;
    if (services) updateData['freelancerProfile.services'] = services;

    const user = await User.findByIdAndUpdate(
      req.userDoc._id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Freelancer profile updated successfully',
      user
    });

  } catch (error) {
    console.error('Update freelancer profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/search
// @desc    Search users by name, skills, or expertise
// @access  Private
router.get('/search', auth, async (req, res) => {
  try {
    const { q, role, page = 1, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const query = {
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { skills: { $in: [new RegExp(q, 'i')] } },
        { 'tutorProfile.expertise': { $in: [new RegExp(q, 'i')] } }
      ]
    };

    if (role && role !== 'all') {
      query.$and.push({ role });
    }

    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ xp: -1 });

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/leaderboard
// @desc    Get top users by XP
// @access  Private
router.get('/leaderboard', auth, async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const users = await User.find()
      .select('name avatar xp level badges stats role')
      .sort({ xp: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      leaderboard: users
    });

  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/users/add-xp
// @desc    Add XP to user (internal use)
// @access  Private
router.post('/add-xp', auth, async (req, res) => {
  try {
    const { points, reason } = req.body;

    if (!points || points <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid XP points required'
      });
    }

    const user = req.userDoc;
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const xpResult = user.addXP(points);
    await user.save();

    res.json({
      success: true,
      message: `Gained ${points} XP for ${reason}`,
      xpResult
    });

  } catch (error) {
    console.error('Add XP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/users/subscribe
// @desc    Subscribe to newsletter and send welcome email
// @access  Public
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Mentora</h1>
        </div>
        <div style="padding: 30px; background: #ffffff;">
          <h2 style="color: #0f172a; margin-top: 0;">Welcome aboard! 🎉</h2>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            Thank you for subscribing to the Mentora newsletter! We're thrilled to have you with us. 
            You'll now receive our weekly updates featuring the best new mentors, top freelance gigs, and exclusive learning resources.
          </p>
          <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px;">
            Explore Mentora
          </a>
        </div>
        <div style="background: #f8fafc; padding: 20px; text-align: center; color: #94a3b8; font-size: 14px;">
          © ${new Date().getFullYear()} Mentora. All rights reserved.
        </div>
      </div>
    `;

    await sendEmail({
      email,
      subject: 'Welcome to Mentora! 🎉',
      html: htmlContent
    });

    res.json({ success: true, message: 'Subscription successful. Welcome email sent!' });

  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ success: false, message: 'Failed to subscribe or send email.' });
  }
});

export default router;