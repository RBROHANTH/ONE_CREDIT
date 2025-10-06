import React from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import AdminLayout from '../components/AdminLayout';

const AdminDashboard = () => {
  const { courses = [], loading, clearAllData } = useAdmin();

  // Show loading state
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to delete ALL courses and start fresh? This action cannot be undone.')) {
      clearAllData();
      window.location.reload(); // Refresh to show empty state
    }
  };

  // Calculate statistics - safely handle undefined/null courses
  const totalCourses = courses?.length || 0;
  const totalLectures = courses?.reduce((total, course) => 
    total + (course.modules?.reduce((moduleTotal, module) => 
      moduleTotal + (module.lectures?.length || 0), 0) || 0), 0
  ) || 0;
  const totalModules = courses?.reduce((total, course) => total + (course.modules?.length || 0), 0) || 0;
  
  const coursesByLevel = courses?.reduce((acc, course) => {
    if (course.level) {
      acc[course.level] = (acc[course.level] || 0) + 1;
    }
    return acc;
  }, {}) || {};

  const recentCourses = courses?.slice(-3).reverse() || []; // Last 3 courses added

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Admin Dashboard</h1>
          <p className="text-gray-600">Manage your educational platform content and courses.</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 text-2xl">📚</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{totalCourses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-2xl">🎥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Lectures</p>
                <p className="text-2xl font-bold text-gray-900">{totalLectures}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 text-2xl">📂</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Modules</p>
                <p className="text-2xl font-bold text-gray-900">{totalModules}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-2xl">⭐</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Duration</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalCourses ? Math.round(courses.reduce((total, course) => 
                    total + parseInt(course.duration), 0) / totalCourses) : 0} weeks
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Course Distribution and Recent Courses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Course Level Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Course Distribution by Level</h3>
            <div className="space-y-3">
              {Object.entries(coursesByLevel).map(([level, count]) => (
                <div key={level} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      level === 'Beginner' ? 'bg-green-500' :
                      level === 'Intermediate' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-gray-700">{level}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-900 font-medium mr-3">{count}</span>
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div 
                        className={`h-2 rounded-full ${
                          level === 'Beginner' ? 'bg-green-500' :
                          level === 'Intermediate' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${(count / totalCourses) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Courses */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Recent Courses</h3>
              <Link 
                to="/admin/manage-courses"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {recentCourses.length > 0 ? (
                recentCourses.map((course) => (
                  <div key={course.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <span className="text-primary-600 font-bold">{course.title.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{course.title}</p>
                      <p className="text-xs text-gray-500">{course.instructor}</p>
                      <p className="text-xs text-gray-400">{course.level} • {course.duration}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No courses added yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/admin/add-course"
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200">
                <span className="text-primary-600 text-xl">➕</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Add New Course</p>
                <p className="text-xs text-gray-500">Create a new course with modules</p>
              </div>
            </Link>

            <Link
              to="/admin/manage-courses"
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200">
                <span className="text-green-600 text-xl">📝</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Manage Courses</p>
                <p className="text-xs text-gray-500">Edit or delete existing courses</p>
              </div>
            </Link>

            <Link
              to="/"
              className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200">
                <span className="text-red-600 text-xl">👁️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">View Public Site</p>
                <p className="text-xs text-gray-500">See how courses appear to users</p>
              </div>
            </Link>
          </div>
          
          {/* Clear Data Section - Only show if there are courses */}
          {courses.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Danger Zone</h4>
              <button
                onClick={handleClearAllData}
                className="flex items-center p-3 border-2 border-dashed border-red-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors group w-full"
              >
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200">
                  <span className="text-red-600 text-lg">🗑️</span>
                </div>
                <div className="ml-3 text-left">
                  <p className="text-sm font-medium text-red-900">Clear All Data</p>
                  <p className="text-xs text-red-600">Remove all courses and start fresh</p>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;