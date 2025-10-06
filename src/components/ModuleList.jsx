import React, { useState, useEffect } from 'react';
import { useStudent } from '../contexts/StudentContext';

const ModuleList = ({ courseId, modules }) => {
  const { currentStudent } = useStudent();
  const [courseProgress, setCourseProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseProgress();
  }, [courseId]);

  const fetchCourseProgress = async () => {
    try {
      // First try the proper student token format
      let token = localStorage.getItem('student_token');
      
      // If not found, try the old format
      if (!token) {
        const studentAuth = localStorage.getItem('edulearn_student_auth');
        if (studentAuth) {
          try {
            const studentData = JSON.parse(studentAuth);
            token = studentData.token;
          } catch (e) {
            console.error('Error parsing student auth data:', e);
          }
        }
      }
      
      if (!token) {
        console.log('No student token found');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/courses/${courseId}/progress`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCourseProgress(data.data);
      } else {
        console.error('Failed to fetch progress:', response.status);
      }
    } catch (error) {
      console.error('Error fetching course progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModuleComplete = async (moduleId) => {
    try {
      // First try the proper student token format
      let token = localStorage.getItem('student_token');
      
      // If not found, try the old format
      if (!token) {
        const studentAuth = localStorage.getItem('edulearn_student_auth');
        if (studentAuth) {
          try {
            const studentData = JSON.parse(studentAuth);
            token = studentData.token;
          } catch (e) {
            console.error('Error parsing student auth data:', e);
          }
        }
      }
      
      if (!token) {
        alert('Please log in as a student to mark modules complete');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/courses/${courseId}/modules/${moduleId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Refresh progress after marking complete
        await fetchCourseProgress();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Error marking module complete');
      }
    } catch (error) {
      console.error('Error marking module complete:', error);
      alert('Error marking module complete');
    }
  };

  const handleModuleReset = async (moduleId) => {
    try {
      const token = localStorage.getItem('edulearn_student_auth');
      if (!token) return;

      const response = await fetch(`http://localhost:5000/api/courses/${courseId}/modules/${moduleId}/complete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Refresh progress after reset
        await fetchCourseProgress();
      }
    } catch (error) {
      console.error('Error resetting module:', error);
    }
  };

  const isModuleCompleted = (moduleId) => {
    return courseProgress?.completedModuleIds?.includes(moduleId) || false;
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Course Progress</h3>
          <span className="text-sm font-medium text-gray-600">
            {courseProgress?.completedModules || 0} of {courseProgress?.totalModules || 0} modules completed
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${courseProgress?.progress || 0}%` }}
          ></div>
        </div>
        <div className="text-right mt-1">
          <span className="text-lg font-bold text-green-600">
            {courseProgress?.progress || 0}%
          </span>
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Modules</h3>
        {modules?.map((module, index) => {
          const isCompleted = isModuleCompleted(module.moduleId);
          const isCurrentModule = courseProgress?.lastAccessedModule === module.moduleId;
          
          return (
            <div
              key={module.moduleId}
              className={`border rounded-lg p-4 transition-all duration-200 ${
                isCompleted 
                  ? 'bg-green-50 border-green-200' 
                  : isCurrentModule 
                    ? 'bg-red-50 border-red-200' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                      isCompleted 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {isCompleted ? '✓' : index + 1}
                    </span>
                    <h4 className={`font-medium ${isCompleted ? 'text-green-800' : 'text-gray-900'}`}>
                      {module.title}
                    </h4>
                    {isCurrentModule && (
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  
                  {module.description && (
                    <p className="text-gray-600 text-sm mb-2 ml-11">
                      {module.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 ml-11">
                    {module.duration && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {module.duration}
                      </span>
                    )}
                    {module.videoUrl && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 2h.01M15 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Video Lesson
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-2 ml-4">
                  {isCompleted ? (
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 text-sm font-medium">Completed</span>
                      <button
                        onClick={() => handleModuleReset(module.moduleId)}
                        className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                      >
                        Reset
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleModuleComplete(module.moduleId)}
                      className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
              
              {/* Module Content */}
              {module.content && (
                <div className="mt-3 ml-11 p-3 bg-gray-50 rounded text-sm text-gray-700">
                  {module.content}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Completion Message */}
      {courseProgress?.progress === 100 && (
        <div className="mt-6 p-4 bg-green-100 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-semibold text-green-800">Congratulations!</h4>
              <p className="text-green-700 text-sm">You have completed all modules in this course!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleList;