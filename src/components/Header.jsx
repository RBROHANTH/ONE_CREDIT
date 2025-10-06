import React from 'react';
import { Link } from 'react-router-dom';
import { useStudent } from '../contexts/StudentContext';

const Header = () => {
  const { isAuthenticated: isStudentAuthenticated, currentStudent, logout: studentLogout } = useStudent();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <Link to="/courses" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">📚</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">EduLearn</h1>
                <p className="text-xs text-gray-500">Student Portal</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <Link 
              to="/courses" 
              className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200"
            >
              All Courses
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200"
            >
              About
            </Link>
            
            {/* Student Authentication */}
            {isStudentAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-sm font-bold">
                      {currentStudent?.firstName?.charAt(0)}{currentStudent?.lastName?.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Welcome, {currentStudent?.firstName}!
                  </span>
                </div>
                <button
                  onClick={studentLogout}
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/" 
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200"
              >
                Back to Home
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;