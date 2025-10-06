import React, { createContext, useContext, useState, useEffect } from 'react';
import { getApiEndpoint } from '../config/api';

const StudentContext = createContext();

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
};

export const StudentProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [students, setStudents] = useState([]);

  // Initialize students and check authentication
  useEffect(() => {
    try {
      // Check if student is already logged in with token
      const studentAuth = localStorage.getItem('edulearn_student_auth');
      const studentToken = localStorage.getItem('edulearn_student_token');
      
      if (studentAuth && studentToken) {
        const studentData = JSON.parse(studentAuth);
        setCurrentStudent(studentData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('LocalStorage error in StudentContext:', error);
      // Fallback to empty state
      setCurrentStudent(null);
      setIsAuthenticated(false);
    }
  }, []);

  // Student signup
  const signup = (studentData) => {
    const { email, password, firstName, lastName } = studentData;
    
    // Check if student already exists
    const existingStudent = students.find(s => s.email === email);
    if (existingStudent) {
      return { success: false, error: 'Student with this email already exists' };
    }

    const newStudent = {
      id: Date.now(),
      email,
      password, // In a real app, this would be hashed
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      joinedDate: new Date().toISOString(),
      enrolledCourses: []
    };

    const updatedStudents = [...students, newStudent];
    setStudents(updatedStudents);
    localStorage.setItem('edulearn_students', JSON.stringify(updatedStudents));

    return { success: true, student: newStudent };
  };

  // Student login - now accepts student data and token from API
  const login = (studentData, token) => {
    setCurrentStudent(studentData);
    setIsAuthenticated(true);
    localStorage.setItem('edulearn_student_auth', JSON.stringify(studentData));
    localStorage.setItem('edulearn_student_token', token);
    return { success: true, student: studentData };
  };

  // Student logout
  const logout = () => {
    setCurrentStudent(null);
    setIsAuthenticated(false);
    localStorage.removeItem('edulearn_student_auth');
    localStorage.removeItem('edulearn_student_token');
  };

  // Update student profile
  const updateProfile = (updatedData) => {
    const updatedStudent = { ...currentStudent, ...updatedData };
    setCurrentStudent(updatedStudent);
    
    const updatedStudents = students.map(s => 
      s.id === currentStudent.id ? updatedStudent : s
    );
    setStudents(updatedStudents);
    
    localStorage.setItem('edulearn_students', JSON.stringify(updatedStudents));
    localStorage.setItem('edulearn_student_auth', JSON.stringify(updatedStudent));
  };

  // Enroll in course - now uses API
  const enrollInCourse = async (courseId) => {
    try {
      const studentToken = localStorage.getItem('edulearn_student_token');
      if (!studentToken) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(getApiEndpoint('courseEnroll', courseId), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${studentToken}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Update the current student's enrolled courses
        const updatedStudent = {
          ...currentStudent,
          enrolledCourses: [...(currentStudent.enrolledCourses || []), courseId]
        };
        setCurrentStudent(updatedStudent);
        localStorage.setItem('edulearn_student_auth', JSON.stringify(updatedStudent));
        return { success: true };
      } else {
        return { success: false, error: result.message || 'Enrollment failed' };
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
      return { success: false, error: 'Network error during enrollment' };
    }
  };

  const value = {
    isAuthenticated,
    currentStudent,
    students,
    signup,
    login,
    logout,
    updateProfile,
    enrollInCourse,
  };

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
};

export default StudentContext;