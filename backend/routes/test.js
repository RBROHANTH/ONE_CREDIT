const express = require('express');
const Course = require('../models/Course');
const Student = require('../models/Student');
const Admin = require('../models/Admin');

const router = express.Router();

// @desc    Test database connectivity and operations
// @route   GET /api/test/db-status
// @access  Public
router.get('/db-status', async (req, res) => {
  try {
    const dbStatus = {
      connected: true,
      timestamp: new Date().toISOString(),
      collections: {},
      operations: {}
    };

    // Test each collection
    try {
      const courseCount = await Course.countDocuments();
      dbStatus.collections.courses = {
        exists: true,
        count: courseCount,
        status: 'accessible'
      };
    } catch (error) {
      dbStatus.collections.courses = {
        exists: false,
        error: error.message,
        status: 'error'
      };
    }

    try {
      const studentCount = await Student.countDocuments();
      dbStatus.collections.students = {
        exists: true,
        count: studentCount,
        status: 'accessible'
      };
    } catch (error) {
      dbStatus.collections.students = {
        exists: false,
        error: error.message,
        status: 'error'
      };
    }

    try {
      const adminCount = await Admin.countDocuments();
      dbStatus.collections.admins = {
        exists: true,
        count: adminCount,
        status: 'accessible'
      };
    } catch (error) {
      dbStatus.collections.admins = {
        exists: false,
        error: error.message,
        status: 'error'
      };
    }

    // Test write operation (create a test document and delete it)
    try {
      const testCourse = new Course({
        title: 'Test Course - DELETE ME',
        description: 'This is a test course for database connectivity',
        instructor: 'Test Instructor',
        duration: '1 hour',
        level: 'Beginner',
        category: 'Test',
        videoUrl: 'https://youtube.com/test'
      });

      const savedCourse = await testCourse.save();
      await Course.findByIdAndDelete(savedCourse._id);

      dbStatus.operations.write = {
        status: 'success',
        message: 'Successfully created and deleted test document'
      };
    } catch (error) {
      dbStatus.operations.write = {
        status: 'error',
        message: error.message
      };
    }

    res.json({
      success: true,
      message: 'Database connectivity test completed',
      data: dbStatus
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connectivity test failed',
      error: error.message,
      connected: false
    });
  }
});

// @desc    Get database statistics
// @route   GET /api/test/db-stats
// @access  Public
router.get('/db-stats', async (req, res) => {
  try {
    const stats = {
      courses: await Course.countDocuments(),
      students: await Student.countDocuments(),
      admins: await Admin.countDocuments(),
      recentCourses: await Course.find().sort({ createdAt: -1 }).limit(3).select('title createdAt'),
      recentStudents: await Student.find().sort({ createdAt: -1 }).limit(3).select('firstName lastName email createdAt'),
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      message: 'Database statistics retrieved successfully',
      data: stats
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve database statistics',
      error: error.message
    });
  }
});

module.exports = router;