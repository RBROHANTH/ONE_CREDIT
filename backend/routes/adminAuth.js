const express = require('express');
const { body, validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const { generateToken } = require('../middleware/auth');

const router = express.Router();

// @desc    Authenticate admin & get token
// @route   POST /api/auth/admin/login
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
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

    const { email, password } = req.body;

    // Check for admin email
    const admin = await Admin.findOne({ email });

    if (admin && (await admin.comparePassword(password))) {
      // Update last login
      admin.lastLogin = new Date();
      await admin.save();

      res.json({
        success: true,
        message: 'Admin login successful',
        data: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          permissions: admin.permissions,
          token: generateToken(admin._id)
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @desc    Get admin profile
// @route   GET /api/auth/admin/profile
// @access  Private (Admin only)
router.get('/profile', async (req, res) => {
  try {
    const admin = await Admin.findById(req.user._id).select('-password');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.json({
      success: true,
      data: admin
    });
  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create default admin (for initial setup)
// @route   POST /api/auth/admin/create-default
// @access  Public (should be disabled in production)
router.post('/create-default', async (req, res) => {
  try {
    // Check if any admin exists
    const adminExists = await Admin.findOne({});
    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: 'Admin already exists. Use login instead.'
      });
    }

    // Create default admin
    const defaultAdmin = await Admin.create({
      name: 'Administrator',
      email: process.env.ADMIN_EMAIL || 'admin@edulearn.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'super_admin',
      permissions: {
        canManageCourses: true,
        canManageStudents: true,
        canManageAdmins: true,
        canViewAnalytics: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Default admin created successfully',
      data: {
        _id: defaultAdmin._id,
        name: defaultAdmin.name,
        email: defaultAdmin.email,
        role: defaultAdmin.role
      }
    });
  } catch (error) {
    console.error('Create default admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating default admin'
    });
  }
});

module.exports = router;