import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStudent } from '../contexts/StudentContext';

const StudentProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useStudent();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to student login, saving the attempted location
    return <Navigate to="/student/login" state={{ from: location }} replace />;
  }

  return children;
};

export default StudentProtectedRoute;