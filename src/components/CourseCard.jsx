import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course, completionData = null }) => {
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

  const isCompleted = completionData && completionData.progress === 100;
  const progressPercentage = completionData ? completionData.progress : 0;

  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden relative ${
      isCompleted ? 'ring-2 ring-green-400' : ''
    }`}>
      {/* Completion Badge */}
      {isCompleted && (
        <div className="absolute top-2 right-2 z-10">
          <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
            ✓ Completed
          </div>
        </div>
      )}
      
      {/* Progress Bar (if student is enrolled but not completed) */}
      {completionData && !isCompleted && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 z-10">
          <div 
            className="h-full bg-red-500 transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      )}
      {/* Course Thumbnail */}
      <div className="h-48 overflow-hidden">
        {course.thumbnail ? (
          <img 
            src={course.thumbnail} 
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="h-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl font-bold">{course.title.charAt(0)}</span>
              </div>
              <p className="text-sm opacity-90">Course Thumbnail</p>
            </div>
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className="p-6">
        {/* Header with Level Badge */}
        <div className="flex justify-between items-start mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
            {course.level}
          </span>
          <span className="text-sm text-gray-500">{course.duration}</span>
        </div>

        {/* Course Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {course.title}
        </h3>

        {/* Instructor */}
        <p className="text-primary-600 font-medium mb-3">
          {course.instructor}
        </p>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {course.description}
        </p>

        {/* Course Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>{course.modules?.length || 0} Modules</span>
          <span>{course.category}</span>
        </div>

        {/* Progress Information */}
        {completionData && (
          <div className="mb-4">
            <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span className={isCompleted ? 'text-green-600 font-bold' : 'text-red-600'}>
                {progressPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  isCompleted ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            {completionData.completedModules && (
              <p className="text-xs text-gray-500 mt-1">
                {completionData.completedModules.length} of {course.modules?.length || 0} modules completed
              </p>
            )}
          </div>
        )}

        {/* View Course Button */}
        <Link
          to={`/courses/${course._id}`}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-200 text-center block ${
            isCompleted 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'bg-primary-600 text-white hover:bg-primary-700'
          }`}
        >
          {isCompleted ? '✓ View Completed Course' : 'View Course'}
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;