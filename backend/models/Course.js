const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [200, 'Course title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    trim: true,
    maxlength: [1000, 'Course description cannot exceed 1000 characters']
  },
  instructor: {
    type: String,
    required: [true, 'Instructor name is required'],
    trim: true,
    maxlength: [100, 'Instructor name cannot exceed 100 characters']
  },
  duration: {
    type: String,
    required: [true, 'Course duration is required'],
    trim: true
  },
  level: {
    type: String,
    required: [true, 'Course level is required'],
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  category: {
    type: String,
    required: [true, 'Course category is required'],
    trim: true
  },
  videoUrl: {
    type: String,
    required: [true, 'Video URL is required'],
    trim: true
  },
  thumbnail: {
    type: String, // Base64 encoded image or URL
    default: ''
  },
  modules: [{
    moduleId: {
      type: String,
      required: true,
      default: () => new mongoose.Types.ObjectId().toString()
    },
    title: {
      type: String,
      required: [true, 'Module title is required'],
      trim: true,
      maxlength: [200, 'Module title cannot exceed 200 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Module description cannot exceed 500 characters']
    },
    videoUrl: {
      type: String,
      trim: true
    },
    duration: {
      type: String, // e.g., "45 minutes", "1.5 hours"
      trim: true
    },
    order: {
      type: Number,
      required: true,
      min: 1
    },
    content: {
      type: String, // Rich text content, markdown, or HTML
      default: ''
    },
    resources: [{
      title: String,
      url: String,
      type: {
        type: String,
        enum: ['pdf', 'video', 'link', 'document', 'quiz']
      }
    }]
  }],
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update the updatedAt field before saving
courseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Course', courseSchema);