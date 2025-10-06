const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Course = require('./models/Course');
const Student = require('./models/Student');
const Admin = require('./models/Admin');

const connectDB = require('./config/database');

const seedData = async () => {
  try {
    await connectDB();
    console.log('🌱 Starting data seeding...');

    // Clear existing data
    await Course.deleteMany({});
    await Student.deleteMany({});
    await Admin.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create sample admin
    const admin = await Admin.create({
      name: 'Administrator',
      email: 'admin@edulearn.com',
      password: 'admin123',
      role: 'super_admin',
      permissions: {
        canManageCourses: true,
        canManageStudents: true,
        canManageAdmins: true,
        canViewAnalytics: true
      }
    });
    console.log('✅ Created admin:', admin.email);

    // Create sample students
    const students = await Student.create([
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@student.com',
        password: 'password123'
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@student.com',
        password: 'password123'
      },
      {
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice.johnson@student.com',
        password: 'password123'
      }
    ]);
    console.log(`✅ Created ${students.length} students`);

    // Create sample courses with modules
    const courses = await Course.create([
      {
        title: 'Introduction to Web Development',
        description: 'Learn the basics of HTML, CSS, and JavaScript to build modern websites.',
        instructor: 'Prof. Sarah Wilson',
        duration: '8 weeks',
        level: 'Beginner',
        category: 'Web Development',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail: '',
        modules: [
          {
            title: 'Introduction to HTML',
            description: 'Learn the fundamentals of HTML structure and elements',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            duration: '45 minutes',
            order: 1,
            content: 'In this module, you will learn about HTML tags, elements, and document structure.'
          },
          {
            title: 'CSS Basics',
            description: 'Style your HTML with CSS properties and selectors',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            duration: '1 hour',
            order: 2,
            content: 'Learn about CSS selectors, properties, and styling techniques.'
          },
          {
            title: 'JavaScript Fundamentals',
            description: 'Add interactivity with JavaScript basics',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            duration: '1.5 hours',
            order: 3,
            content: 'Introduction to JavaScript variables, functions, and DOM manipulation.'
          },
          {
            title: 'Building Your First Website',
            description: 'Put it all together to create a complete website',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            duration: '2 hours',
            order: 4,
            content: 'Create a fully functional website using HTML, CSS, and JavaScript.'
          }
        ]
      },
      {
        title: 'Advanced React Development',
        description: 'Master React hooks, context, and state management for building complex applications.',
        instructor: 'Dr. Michael Chen',
        duration: '12 weeks',
        level: 'Advanced',
        category: 'Frontend Development',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail: '',
        modules: [
          {
            title: 'React Hooks Deep Dive',
            description: 'Master useState, useEffect, and custom hooks',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            duration: '2 hours',
            order: 1,
            content: 'Deep dive into React hooks and their use cases.'
          },
          {
            title: 'Context API and State Management',
            description: 'Learn global state management with Context API',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            duration: '1.5 hours',
            order: 2,
            content: 'Implement global state management using React Context.'
          },
          {
            title: 'Performance Optimization',
            description: 'Optimize React apps for better performance',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            duration: '2.5 hours',
            order: 3,
            content: 'Learn React.memo, useMemo, useCallback, and other optimization techniques.'
          }
        ]
      },
      {
        title: 'Database Design and MongoDB',
        description: 'Learn database concepts and work with MongoDB for modern applications.',
        instructor: 'Prof. Emily Davis',
        duration: '10 weeks',
        level: 'Intermediate',
        category: 'Database',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail: '',
        modules: [
          {
            title: 'Database Fundamentals',
            description: 'Understanding database concepts and design principles',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            duration: '1 hour',
            order: 1,
            content: 'Learn about relational vs NoSQL databases and design patterns.'
          },
          {
            title: 'MongoDB Setup and Basics',
            description: 'Setting up MongoDB and basic operations',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            duration: '1.5 hours',
            order: 2,
            content: 'Install MongoDB and learn basic CRUD operations.'
          },
          {
            title: 'Advanced MongoDB Queries',
            description: 'Complex queries and aggregation pipelines',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            duration: '2 hours',
            order: 3,
            content: 'Master MongoDB aggregation and complex query operations.'
          },
          {
            title: 'MongoDB with Node.js',
            description: 'Integrating MongoDB with Node.js applications',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            duration: '2.5 hours',
            order: 4,
            content: 'Use Mongoose to connect MongoDB with Node.js applications.'
          }
        ]
      },
      {
        title: 'Node.js Backend Development',
        description: 'Build scalable server-side applications using Node.js and Express.js.',
        instructor: 'Mr. David Rodriguez',
        duration: '14 weeks',
        level: 'Intermediate',
        category: 'Backend Development',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail: '',
        modules: [
          {
            title: 'Node.js Fundamentals',
            description: 'Understanding Node.js runtime and core modules',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            duration: '1.5 hours',
            order: 1,
            content: 'Learn about Node.js event loop, modules, and file system operations.'
          },
          {
            title: 'Express.js Framework',
            description: 'Building web servers with Express.js',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            duration: '2 hours',
            order: 2,
            content: 'Create RESTful APIs and web servers using Express.js.'
          },
          {
            title: 'Authentication and Security',
            description: 'Implementing authentication and security best practices',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            duration: '2.5 hours',
            order: 3,
            content: 'Learn JWT authentication, password hashing, and security middleware.'
          }
        ]
      },
      {
        title: 'Machine Learning Fundamentals',
        description: 'Introduction to machine learning algorithms and their practical applications.',
        instructor: 'Dr. Lisa Wang',
        duration: '16 weeks',
        level: 'Advanced',
        category: 'Artificial Intelligence',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail: '',
        modules: [
          {
            title: 'Introduction to Machine Learning',
            description: 'Understanding ML concepts and types of learning',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            duration: '2 hours',
            order: 1,
            content: 'Learn about supervised, unsupervised, and reinforcement learning.'
          },
          {
            title: 'Linear Regression and Classification',
            description: 'Building your first ML models',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            duration: '3 hours',
            order: 2,
            content: 'Implement linear regression and logistic regression models.'
          },
          {
            title: 'Neural Networks Basics',
            description: 'Introduction to artificial neural networks',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            duration: '3.5 hours',
            order: 3,
            content: 'Understand perceptrons, multilayer networks, and backpropagation.'
          },
          {
            title: 'Deep Learning with TensorFlow',
            description: 'Building deep learning models with TensorFlow',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            duration: '4 hours',
            order: 4,
            content: 'Create and train deep neural networks using TensorFlow.'
          },
          {
            title: 'ML Project: Image Classification',
            description: 'Complete project building an image classifier',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            duration: '5 hours',
            order: 5,
            content: 'Build a complete image classification system from scratch.'
          }
        ]
      }
    ]);
    console.log(`✅ Created ${courses.length} courses`);

    // Enroll some students in courses
    const firstStudent = students[0];
    const secondStudent = students[1];

    // Enroll first student in first two courses with some modules completed
    firstStudent.enrolledCourses.push({
      courseId: courses[0]._id,
      completedModules: [
        { moduleId: courses[0].modules[0].moduleId, completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
        { moduleId: courses[0].modules[1].moduleId, completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
      ],
      progress: Math.round((2 / courses[0].modules.length) * 100), // 50% for 2 out of 4 modules
      lastAccessedModule: courses[0].modules[1].moduleId,
      lastAccessed: new Date()
    });

    firstStudent.enrolledCourses.push({
      courseId: courses[1]._id,
      completedModules: [
        { moduleId: courses[1].modules[0].moduleId, completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
      ],
      progress: Math.round((1 / courses[1].modules.length) * 100), // 33% for 1 out of 3 modules
      lastAccessedModule: courses[1].modules[0].moduleId,
      lastAccessed: new Date()
    });

    await firstStudent.save();

    // Enroll second student in different courses
    secondStudent.enrolledCourses.push({
      courseId: courses[2]._id,
      completedModules: [
        { moduleId: courses[2].modules[0].moduleId, completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
        { moduleId: courses[2].modules[1].moduleId, completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
        { moduleId: courses[2].modules[2].moduleId, completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
      ],
      progress: Math.round((3 / courses[2].modules.length) * 100), // 75% for 3 out of 4 modules
      lastAccessedModule: courses[2].modules[2].moduleId,
      lastAccessed: new Date()
    });

    secondStudent.enrolledCourses.push({
      courseId: courses[3]._id,
      completedModules: [
        { moduleId: courses[3].modules[0].moduleId, completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
        { moduleId: courses[3].modules[1].moduleId, completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
        { moduleId: courses[3].modules[2].moduleId, completedAt: new Date() }
      ],
      progress: 100, // 100% for all 3 modules completed
      lastAccessedModule: courses[3].modules[2].moduleId,
      lastAccessed: new Date()
    });

    await secondStudent.save();

    // Update course enrollment
    courses[0].enrolledStudents.push(firstStudent._id);
    courses[1].enrolledStudents.push(firstStudent._id);
    courses[2].enrolledStudents.push(secondStudent._id);
    courses[3].enrolledStudents.push(secondStudent._id);

    await Promise.all([
      courses[0].save(),
      courses[1].save(),
      courses[2].save(),
      courses[3].save()
    ]);

    console.log('✅ Set up course enrollments');

    console.log('\n🎉 Data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   • ${await Admin.countDocuments()} admins created`);
    console.log(`   • ${await Student.countDocuments()} students created`);
    console.log(`   • ${await Course.countDocuments()} courses created`);
    console.log('\n💡 You can now see data in MongoDB Atlas!');
    console.log('\n🔐 Test Credentials:');
    console.log('   Admin: admin@edulearn.com / admin123');
    console.log('   Student: john.doe@student.com / password123');
    console.log('   Student: jane.smith@student.com / password123');

    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();