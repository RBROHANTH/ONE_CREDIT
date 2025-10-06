const express = require('express');
const { body, validationResult } = require('express-validator');
const Student = require('../models/Student');
const { generateToken } = require('../middleware/auth');

const router = express.Router();

// @desc    Register a new student
// @route   POST /api/auth/student/register
// @access  Public
router.post('/register', [
  body('firstName').notEmpty().trim().withMessage('First name is required'),
  body('lastName').notEmpty().trim().withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
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

    const { firstName, lastName, email, password } = req.body;

    // Check if student already exists
    const studentExists = await Student.findOne({ email });
    if (studentExists) {
      return res.status(400).json({
        success: false,
        message: 'Student already exists with this email'
      });
    }

    // Create student
    const student = await Student.create({
      firstName,
      lastName,
      email,
      password
    });

    if (student) {
      res.status(201).json({
        success: true,
        message: 'Student registered successfully',
        data: {
          _id: student._id,
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          token: generateToken(student._id)
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid student data'
      });
    }
  } catch (error) {
    console.error('Student registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// @desc    Authenticate student & get token
// @route   POST /api/auth/student/login
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

    // Check for student email
    const student = await Student.findOne({ email });

    if (student && (await student.comparePassword(password))) {
      // Update last login
      student.lastLogin = new Date();
      await student.save();

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          _id: student._id,
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          enrolledCourses: student.enrolledCourses,
          token: generateToken(student._id)
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
  } catch (error) {
    console.error('Student login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @desc    Get student profile
// @route   GET /api/auth/student/profile
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    const student = await Student.findById(req.user._id)
      .select('-password')
      .populate('enrolledCourses.courseId', 'title instructor duration level');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;