import React, { useState, useEffect } from 'react';
import CourseCard from '../components/CourseCard';
import { getApiEndpoint } from '../config/api';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [studentProgress, setStudentProgress] = useState({});

  // Fetch student progress for enrolled courses
  const fetchStudentProgress = async () => {
    const token = localStorage.getItem('student_token');
    if (!token) return {};

    try {
      const response = await fetch(getApiEndpoint('enrolledCourses'), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const progressMap = {};
        
        if (data.success && data.data) {
          data.data.forEach(enrollment => {
            progressMap[enrollment.courseId._id] = {
              progress: enrollment.progress || 0,
              completedModules: enrollment.completedModules || [],
              lastAccessed: enrollment.lastAccessed,
              enrolledAt: enrollment.enrolledAt
            };
          });
        }
        
        return progressMap;
      }
    } catch (error) {
      console.error('Error fetching student progress:', error);
    }
    
    return {};
  };

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(getApiEndpoint('courses'));
        const data = await response.json();
        
        if (data.success) {
          setCourses(data.data);
          
          // Also fetch student progress if logged in
          const progress = await fetchStudentProgress();
          setStudentProgress(progress);
        } else {
          setError('Failed to load courses');
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to connect to server');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter courses based on search term and level
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = selectedLevel === '' || course.level === selectedLevel;
    
    return matchesSearch && matchesLevel;
  });

  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-red-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Explore Our Courses
          </h1>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Discover high-quality educational content from expert instructors across various domains
          </p>
          
          {/* Search and Filter */}
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search courses, instructors, or topics..."
                className="w-full px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <select
                className="w-full sm:w-auto px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                <option value="">All Levels</option>
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Results Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Available Courses
          </h2>
          <p className="text-gray-600">
            {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
            {searchTerm && ` for "${searchTerm}"`}
            {selectedLevel && ` in ${selectedLevel} level`}
          </p>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
              <span className="text-gray-400 text-2xl">⏳</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading courses...</h3>
            <p className="text-gray-500">Please wait while we fetch the latest courses</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-2xl">❌</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading courses</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map(course => (
              <CourseCard 
                key={course._id} 
                course={course} 
                completionData={studentProgress[course._id] || null}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-400 text-2xl">📚</span>
            </div>
            {courses.length === 0 ? (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No courses available yet</h3>
                <p className="text-gray-500 mb-4">
                  This platform is ready for content! Admins can add courses to get started.
                </p>
                <p className="text-sm text-gray-400">
                  Admin? <a href="/admin/login" className="text-red-600 hover:text-red-700">Log in here</a> to add the first course.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-500">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseList;