// API Configuration
const API_CONFIG = {
  // Use environment variable if available, otherwise default to localhost
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  
  // API endpoints
  endpoints: {
    // Auth endpoints
    adminLogin: '/api/auth/admin/login',
    studentLogin: '/api/auth/student/login',
    studentRegister: '/api/auth/student/register',
    
    // Course endpoints
    courses: '/api/courses',
    courseDetails: (id) => `/api/courses/${id}`,
    courseEnroll: (id) => `/api/courses/${id}/enroll`,
    enrolledCourses: '/api/courses/enrolled',
    
    // Progress endpoints
    courseProgress: (id) => `/api/courses/${id}/progress`,
    moduleComplete: (courseId, moduleId) => `/api/courses/${courseId}/modules/${moduleId}/complete`,
    
    // Health check
    health: '/api/health'
  }
};

// Helper function to build full URL
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.baseURL}${endpoint}`;
};

// Helper function to get full endpoint URL
export const getApiEndpoint = (endpointKey, ...params) => {
  const endpoint = typeof API_CONFIG.endpoints[endpointKey] === 'function' 
    ? API_CONFIG.endpoints[endpointKey](...params)
    : API_CONFIG.endpoints[endpointKey];
    
  return buildApiUrl(endpoint);
};

// Export the config
export default API_CONFIG;

// Usage examples:
// getApiEndpoint('courses') -> 'http://localhost:5000/api/courses'
// getApiEndpoint('courseDetails', 'course123') -> 'http://localhost:5000/api/courses/course123'
// buildApiUrl('/api/custom-endpoint') -> 'http://localhost:5000/api/custom-endpoint'