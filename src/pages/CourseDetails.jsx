import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStudent } from '../contexts/StudentContext';
import { convertToEmbedUrl } from '../utils/helpers';
import ModuleList from '../components/ModuleList';

const CourseDetails = () => {
  const { courseId } = useParams();
  const { isAuthenticated } = useStudent();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('CourseDetails component rendered with courseId:', courseId);

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      console.log('Fetching course with ID:', courseId);
      const response = await fetch(`http://localhost:5000/api/courses/${courseId}`);
      const data = await response.json();
      
      console.log('Course fetch response:', data);
      if (data.success) {
        setCourse(data.data);
      } else {
        setError(data.message || 'Failed to fetch course');
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      setError('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error loading course</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link to="/courses" className="text-primary-600 hover:text-primary-700">
            ← Back to courses
          </Link>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course not found</h2>
          <Link to="/courses" className="text-primary-600 hover:text-primary-700">
            ← Back to courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                <Link to="/courses" className="hover:text-primary-600">Courses</Link>
                <span>›</span>
                <span className="text-gray-900">{course.title}</span>
              </nav>
              <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
              <p className="text-lg text-primary-600 mt-1">{course.instructor}</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                {course.level}
              </span>
              <p className="text-sm text-gray-500 mt-1">{course.duration}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video and Content */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={convertToEmbedUrl(course.videoUrl)}
                  title={course.title}
                  className="w-full h-96"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            {/* Course Description */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About This Course</h2>
              <p className="text-gray-700 leading-relaxed">{course.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Level</h3>
                  <p className="mt-1 text-sm text-gray-900">{course.level}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Duration</h3>
                  <p className="mt-1 text-sm text-gray-900">{course.duration}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Category</h3>
                  <p className="mt-1 text-sm text-gray-900">{course.category}</p>
                </div>
              </div>
            </div>

            {/* Debug Section for Testing */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-bold text-yellow-800 mb-2">🔧 Testing Tools</h3>
              <p className="text-xs text-yellow-700 mb-3">
                Student Token: {localStorage.getItem('student_token') ? 'Found' : 'Not Found'}
              </p>
              <button 
                onClick={() => {
                  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZTM0ZmM3ZTAyYTUxNjg1ZDFmMTk0YiIsImlhdCI6MTc1OTcyNzU2NSwiZXhwIjoxNzYyMzE5NTY1fQ.m4DuvWvuu2kW1YNgzFlCucKUZHCywY_g5ZQTSTtDzzg';
                  localStorage.setItem('student_token', token);
                  localStorage.setItem('student_data', JSON.stringify({
                    email: 'student@test.com',
                    firstName: 'Test',
                    lastName: 'Student'
                  }));
                  window.location.reload();
                }}
                className="px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700 mr-2"
              >
                Login as Test Student
              </button>
              <button 
                onClick={async () => {
                  const token = localStorage.getItem('student_token');
                  if (!token) {
                    alert('Please login as student first');
                    return;
                  }
                  try {
                    const response = await fetch(`http://localhost:5000/api/courses/${courseId}/enroll`, {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                      }
                    });
                    const result = await response.json();
                    if (result.success) {
                      alert('Successfully enrolled in course!');
                      window.location.reload();
                    } else {
                      alert(result.message || 'Enrollment failed');
                    }
                  } catch (error) {
                    alert('Error enrolling in course');
                  }
                }}
                className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
              >
                Enroll in Course
              </button>
            </div>

            {/* Module List with Progress */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <ModuleList courseId={courseId} modules={course.modules} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Course Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Instructor</p>
                    <p className="text-sm text-gray-600">{course.instructor}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Duration</p>
                    <p className="text-sm text-gray-600">{course.duration}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Level</p>
                    <p className="text-sm text-gray-600">{course.level}</p>
                  </div>
                </div>

                {course.modules && course.modules.length > 0 && (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Modules</p>
                      <p className="text-sm text-gray-600">{course.modules.length} modules</p>
                    </div>
                  </div>
                )}
              </div>

              {!isAuthenticated && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800 mb-3">
                    Sign in to track your progress and access course modules
                  </p>
                  <Link
                    to="/student/login"
                    className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200 text-center block"
                  >
                    Sign In to Start Learning
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;