import React, { createContext, useContext, useState, useEffect } from 'react';
import { getApiEndpoint } from '../config/api';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Initialize and check authentication
  useEffect(() => {
    try {
      // Check if admin is already logged in with token
      const adminToken = localStorage.getItem('admin_token');
      const adminData = localStorage.getItem('admin_data');
      
      if (adminToken && adminData) {
        setIsAuthenticated(true);
        // Fetch courses when admin is authenticated
        fetchCourses();
      } else {
        setIsAuthenticated(false);
        setCourses([]);
      }
    } catch (error) {
      console.error('LocalStorage error in AdminContext:', error);
      // Fallback to empty state
      setCourses([]);
      setIsAuthenticated(false);
    }
  }, []);

  // Fetch courses from API
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const adminToken = localStorage.getItem('admin_token');
      if (!adminToken) {
        setCourses([]);
        return;
      }

      const response = await fetch(getApiEndpoint('courses'), {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (result.success) {
        setCourses(result.data || []);
      } else {
        console.error('Failed to fetch courses:', result.message);
        setCourses([]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // Admin login - now accepts token from API
  const login = (adminData, token) => {
    setIsAuthenticated(true);
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_data', JSON.stringify(adminData));
    // Fetch courses after successful login
    fetchCourses();
    return { success: true };
  };

  // Admin logout
  const logout = () => {
    setIsAuthenticated(false);
    setCourses([]); // Clear courses on logout
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_data');
  };

  // Add new course
  const addCourse = (courseData) => {
    const newCourse = {
      ...courseData,
      id: Date.now(), // Simple ID generation
    };
    
    const updatedCourses = [...courses, newCourse];
    setCourses(updatedCourses);
    localStorage.setItem('edulearn_courses', JSON.stringify(updatedCourses));
    return newCourse;
  };

  // Update existing course
  const updateCourse = (courseId, courseData) => {
    const updatedCourses = courses.map(course => 
      course.id === courseId ? { ...courseData, id: courseId } : course
    );
    setCourses(updatedCourses);
    localStorage.setItem('edulearn_courses', JSON.stringify(updatedCourses));
  };

  // Delete course
  const deleteCourse = (courseId) => {
    const updatedCourses = courses.filter(course => course.id !== courseId);
    setCourses(updatedCourses);
    localStorage.setItem('edulearn_courses', JSON.stringify(updatedCourses));
  };

  // Get course by ID
  const getCourseById = (courseId) => {
    return courses.find(course => course.id === parseInt(courseId));
  };

  // Clear all data (useful for starting fresh)
  const clearAllData = () => {
    setCourses([]);
    localStorage.setItem('edulearn_courses', JSON.stringify([]));
    // Optionally clear admin auth as well
    // localStorage.removeItem('edulearn_admin_auth');
    // setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    courses,
    loading,
    login,
    logout,
    fetchCourses,
    addCourse,
    updateCourse,
    deleteCourse,
    getCourseById,
    clearAllData,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContext;