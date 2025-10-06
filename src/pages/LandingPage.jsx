import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">📚</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">EduLearn</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-red-600">EduLearn</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your gateway to quality online education. Access comprehensive courses, 
            track your progress, and learn from expert instructors.
          </p>
        </div>

        {/* Login Options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Student Login Card */}
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 border border-gray-100">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">👨‍🎓</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Student Portal</h2>
              <p className="text-gray-600 mb-6">
                Access your courses, track progress, and continue your learning journey.
              </p>
              <div className="space-y-3">
                <Link
                  to="/student/login"
                  className="block w-full bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Student Login
                </Link>
                <Link
                  to="/student/signup"
                  className="block w-full border border-red-600 text-red-600 py-3 px-6 rounded-lg font-medium hover:bg-red-50 transition-colors"
                >
                  Create Student Account
                </Link>
              </div>
            </div>
          </div>

          {/* Admin Login Card */}
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 border border-gray-100">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl">👨‍💼</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Portal</h2>
              <p className="text-gray-600 mb-6">
                Manage courses, students, and oversee the learning platform.
              </p>
              <div className="space-y-3">
                <Link
                  to="/admin/login"
                  className="block w-full bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Admin Login
                </Link>
                <div className="text-sm text-gray-500">
                  Admin access only
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Why Choose EduLearn?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Expert-Led Courses</h4>
              <p className="text-gray-600">
                Learn from industry professionals and academic experts.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Progress Tracking</h4>
              <p className="text-gray-600">
                Monitor your learning progress with detailed analytics.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🌐</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Accessible Anywhere</h4>
              <p className="text-gray-600">
                Learn at your own pace, anytime and anywhere.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 EduLearn. Empowering education through technology.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;