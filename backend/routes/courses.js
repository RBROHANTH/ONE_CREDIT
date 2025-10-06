const express = require('express');
const { body, validationResult } = require('express-validator');
const Course = require('../models/Course');
const Student = require('../models/Student');
const { protectAdmin, protectStudent, protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public (for browsing) / Private (for enrolled students)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, level, search } = req.query;

    // Build query
    let query = {};
    
    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }
    
    if (level) {
      query.level = level;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { instructor: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(query)
      .select('-enrolledStudents') // Don't expose student list to public
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Course.countDocuments(query);

    res.json({
      success: true,
      data: courses,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching courses'
    });
  }
});

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('enrolledStudents', 'firstName lastName email')
      .select('-enrolledStudents'); // Don't expose student details to public

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching course'
    });
  }
});

// @desc    Create new course
// @route   POST /api/courses
// @access  Private (Admin only)
router.post('/', protectAdmin, [
  body('title').notEmpty().trim().withMessage('Course title is required'),
  body('description').notEmpty().trim().withMessage('Course description is required'),
  body('instructor').notEmpty().trim().withMessage('Instructor name is required'),
  body('duration').notEmpty().trim().withMessage('Course duration is required'),
  body('level').isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Invalid course level'),
  body('category').notEmpty().trim().withMessage('Course category is required'),
  body('videoUrl').notEmpty().trim().withMessage('Video URL is required')
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

    const course = await Course.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating course'
    });
  }
});

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Admin only)
router.put('/:id', protectAdmin, [
  body('title').optional().notEmpty().trim().withMessage('Course title cannot be empty'),
  body('description').optional().notEmpty().trim().withMessage('Course description cannot be empty'),
  body('instructor').optional().notEmpty().trim().withMessage('Instructor name cannot be empty'),
  body('duration').optional().notEmpty().trim().withMessage('Course duration cannot be empty'),
  body('level').optional().isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Invalid course level'),
  body('category').optional().notEmpty().trim().withMessage('Course category cannot be empty'),
  body('videoUrl').optional().notEmpty().trim().withMessage('Video URL cannot be empty')
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

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: course
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating course'
    });
  }
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Admin only)
router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Remove course from all enrolled students
    await Student.updateMany(
      { 'enrolledCourses.courseId': req.params.id },
      { $pull: { enrolledCourses: { courseId: req.params.id } } }
    );

    await Course.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting course'
    });
  }
});

// @desc    Enroll in course
// @route   POST /api/courses/:id/enroll
// @access  Private (Student only)
router.post('/:id/enroll', protectStudent, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    const student = await Student.findById(req.user._id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if already enrolled
    const alreadyEnrolled = student.enrolledCourses.some(
      enrollment => enrollment.courseId.toString() === req.params.id
    );

    if (alreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    // Add student to course
    course.enrolledStudents.push(student._id);
    await course.save();

    // Add course to student
    student.enrolledCourses.push({
      courseId: course._id,
      enrolledAt: new Date(),
      progress: 0
    });
    await student.save();

    res.json({
      success: true,
      message: 'Successfully enrolled in course',
      data: {
        courseId: course._id,
        title: course.title,
        enrolledAt: new Date()
      }
    });
  } catch (error) {
    console.error('Enroll course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error enrolling in course'
    });
  }
});

// @desc    Get enrolled courses for student
// @route   GET /api/courses/student/enrolled
// @access  Private (Student only)
router.get('/student/enrolled', protectStudent, async (req, res) => {
  try {
    const student = await Student.findById(req.user._id)
      .populate('enrolledCourses.courseId', 'title description instructor duration level category thumbnail modules');

    res.json({
      success: true,
      data: student.enrolledCourses
    });
  } catch (error) {
    console.error('Get enrolled courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching enrolled courses'
    });
  }
});

// @desc    Mark module as complete
// @route   POST /api/courses/:courseId/modules/:moduleId/complete
// @access  Private (Student only)
router.post('/:courseId/modules/:moduleId/complete', protectStudent, async (req, res) => {
  try {
    const { courseId, moduleId } = req.params;
    const studentId = req.user._id;

    // Find the course and verify module exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const module = course.modules.find(mod => mod.moduleId === moduleId);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Module not found'
      });
    }

    // Find the student and check enrollment
    const student = await Student.findById(studentId);
    const enrollment = student.enrolledCourses.find(
      course => course.courseId.toString() === courseId
    );

    if (!enrollment) {
      return res.status(400).json({
        success: false,
        message: 'Student not enrolled in this course'
      });
    }

    // Check if module is already completed
    const alreadyCompleted = enrollment.completedModules.some(
      comp => comp.moduleId === moduleId
    );

    if (alreadyCompleted) {
      return res.status(400).json({
        success: false,
        message: 'Module already completed'
      });
    }

    // Mark module as complete
    enrollment.completedModules.push({
      moduleId,
      completedAt: new Date()
    });

    // Calculate new progress
    const totalModules = course.modules.length;
    const completedCount = enrollment.completedModules.length;
    enrollment.progress = Math.round((completedCount / totalModules) * 100);

    // Update last accessed
    enrollment.lastAccessedModule = moduleId;
    enrollment.lastAccessed = new Date();

    await student.save();

    res.json({
      success: true,
      message: 'Module marked as complete',
      data: {
        moduleId,
        progress: enrollment.progress,
        completedModules: enrollment.completedModules.length,
        totalModules
      }
    });

  } catch (error) {
    console.error('Mark module complete error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error marking module complete'
    });
  }
});

// @desc    Get course progress for student
// @route   GET /api/courses/:courseId/progress
// @access  Private (Student only)
router.get('/:courseId/progress', protectStudent, async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const student = await Student.findById(studentId);
    const enrollment = student.enrolledCourses.find(
      course => course.courseId.toString() === courseId
    );

    if (!enrollment) {
      return res.status(400).json({
        success: false,
        message: 'Student not enrolled in this course'
      });
    }

    const totalModules = course.modules.length;
    const completedModules = enrollment.completedModules;
    const progress = totalModules > 0 ? Math.round((completedModules.length / totalModules) * 100) : 0;

    // Update progress if it's different
    if (enrollment.progress !== progress) {
      enrollment.progress = progress;
      await student.save();
    }

    res.json({
      success: true,
      data: {
        courseId,
        totalModules,
        completedModules: completedModules.length,
        progress,
        completedModuleIds: completedModules.map(cm => cm.moduleId),
        lastAccessedModule: enrollment.lastAccessedModule,
        lastAccessed: enrollment.lastAccessed
      }
    });

  } catch (error) {
    console.error('Get course progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching course progress'
    });
  }
});

// @desc    Reset module completion (for testing)
// @route   DELETE /api/courses/:courseId/modules/:moduleId/complete
// @access  Private (Student only)
router.delete('/:courseId/modules/:moduleId/complete', protectStudent, async (req, res) => {
  try {
    const { courseId, moduleId } = req.params;
    const studentId = req.user._id;

    const student = await Student.findById(studentId);
    const enrollment = student.enrolledCourses.find(
      course => course.courseId.toString() === courseId
    );

    if (!enrollment) {
      return res.status(400).json({
        success: false,
        message: 'Student not enrolled in this course'
      });
    }

    // Remove module from completed list
    enrollment.completedModules = enrollment.completedModules.filter(
      comp => comp.moduleId !== moduleId
    );

    // Recalculate progress
    const course = await Course.findById(courseId);
    const totalModules = course.modules.length;
    const completedCount = enrollment.completedModules.length;
    enrollment.progress = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

    await student.save();

    res.json({
      success: true,
      message: 'Module completion reset',
      data: {
        moduleId,
        progress: enrollment.progress,
        completedModules: enrollment.completedModules.length,
        totalModules
      }
    });

  } catch (error) {
    console.error('Reset module completion error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error resetting module completion'
    });
  }
});

module.exports = router;