// Simple test script to create default admin
const fetch = require('node-fetch');

const createDefaultAdmin = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/admin/create-default', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.json();
    console.log('Create admin result:', result);
  } catch (error) {
    console.error('Error:', error);
  }
};

createDefaultAdmin();