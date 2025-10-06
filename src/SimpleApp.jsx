import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Simple test components
const HomePage = () => (
  <div style={{ padding: '20px', fontFamily: 'Arial' }}>
    <h1>🏠 Home Page</h1>
    <p>This is a simple home page without contexts.</p>
    <div style={{ marginTop: '20px' }}>
      <a href="/student/login" style={{ 
        padding: '10px 20px', 
        backgroundColor: '#007bff', 
        color: 'white', 
        textDecoration: 'none',
        borderRadius: '4px'
      }}>
        Go to Student Login
      </a>
    </div>
  </div>
);

const StudentLoginPage = () => (
  <div style={{ padding: '20px', fontFamily: 'Arial' }}>
    <h1>👨‍🎓 Student Login</h1>
    <p>This is a simple login page without contexts.</p>
    <form style={{ maxWidth: '300px' }}>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
        <input 
          type="email" 
          style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          placeholder="Enter your email"
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
        <input 
          type="password" 
          style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          placeholder="Enter your password"
        />
      </div>
      <button 
        type="submit"
        style={{ 
          width: '100%', 
          padding: '10px', 
          backgroundColor: '#28a745', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Sign In
      </button>
    </form>
  </div>
);

const ErrorPage = () => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h1>❌ 404 - Page Not Found</h1>
    <a href="/">Go Home</a>
  </div>
);

// Simple router without contexts
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/student/login",
    element: <StudentLoginPage />,
  },
]);

function SimpleApp() {
  console.log('SimpleApp component rendered');
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <RouterProvider router={router} />
    </div>
  );
}

export default SimpleApp;