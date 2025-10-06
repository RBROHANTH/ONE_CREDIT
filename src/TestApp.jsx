import React from 'react';

// Simple test component to check if React is working
const TestApp = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🚀 React App Test</h1>
      <p>If you can see this, React is working!</p>
      <div style={{ backgroundColor: '#f0f0f0', padding: '10px', marginTop: '10px' }}>
        <h2>Debug Info:</h2>
        <p>Date: {new Date().toLocaleString()}</p>
        <p>Environment: {import.meta.env.MODE}</p>
      </div>
    </div>
  );
};

export default TestApp;