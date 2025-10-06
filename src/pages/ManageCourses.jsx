import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import AdminLayout from '../components/AdminLayout';

const ManageCourses = () => {
  const { courses = [], deleteCourse } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  // Filter courses - safely handle undefined courses
  const filteredCourses = (courses || []).filter(course => {
    const matchesSearch = course?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course?.instructor?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === '' || course?.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const handleDeleteClick = (course) => {
    setCourseToDelete(course);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (courseToDelete) {
      deleteCourse(courseToDelete.id);
      setShowDeleteModal(false);
      setCourseToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCourseToDelete(null);
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Manage Courses</h1>
              <p className="text-gray-600">View, edit, and delete existing courses.</p>
            </div>
            <Link
              to="/admin/add-course"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Add New Course
            </Link>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search courses or instructors..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <select
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                <option value="">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Course List */}
        <div className="bg-white rounded-lg shadow-sm">
          {filteredCourses.length > 0 ? (
            <>
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
                </h3>
              </div>
              
              <div className="divide-y divide-gray-200">
                {filteredCourses.map((course) => (
                  <div key={course?.id || course?._id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-xl font-bold text-gray-900">{course?.title || 'Untitled Course'}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course?.level)}`}>
                            {course?.level || 'Unknown'}
                          </span>
                        </div>
                        
                        <p className="text-primary-600 font-medium mb-2">{course?.instructor || 'Unknown Instructor'}</p>
                        <p className="text-gray-600 mb-3 line-clamp-2">{course?.description || 'No description available'}</p>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <span>📅 {course?.duration || 'N/A'}</span>
                          <span>📂 {course?.modules?.length || 0} modules</span>
                          <span>🎥 {course?.modules?.reduce((total, module) => total + (module?.lectures?.length || 0), 0) || 0} lectures</span>
                          <span>📋 {course?.materials?.length || 0} materials</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleDeleteClick(course)}
                          className="text-red-600 hover:text-red-700 px-3 py-1 rounded text-sm font-medium"
                          title="Delete Course"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-2xl">📚</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || selectedLevel 
                  ? 'Try adjusting your search terms or filters.'
                  : 'You haven\'t created any courses yet.'
                }
              </p>
              {!searchTerm && !selectedLevel && (
                <Link
                  to="/admin/add-course"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  Create Your First Course
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-mx">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-red-600 text-xl">⚠️</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Delete Course</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "<strong>{courseToDelete?.title}</strong>"? 
              This action cannot be undone and will permanently remove all course content, 
              modules, and lectures.
            </p>
            
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete Course
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageCourses;