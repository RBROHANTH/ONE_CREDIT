import React from 'react';

const DebugComponent = () => {
  console.log('DebugComponent rendered successfully');
  
  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333' }}>🔧 Debug Mode Active</h1>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '15px', 
        borderRadius: '8px',
        margin: '10px 0'
      }}>
        <h2>✅ React is Working!</h2>
        <p>If you see this message, React is rendering properly.</p>
        <p><strong>Time:</strong> {new Date().toLocaleString()}</p>
        <p><strong>Environment:</strong> {import.meta.env.MODE}</p>
      </div>
      
      <div style={{ 
        backgroundColor: '#e8f5e8', 
        padding: '15px', 
        borderRadius: '8px',
        margin: '10px 0'
      }}>
        <h3>🌐 Network Check</h3>
        <p>Frontend URL: http://localhost:5174/</p>
        <p>Backend URL: http://localhost:5000/</p>
        <button 
          onClick={() => {
            fetch('http://localhost:5000/api/health')
              .then(res => res.json())
              .then(data => alert('Backend connected: ' + JSON.stringify(data)))
              .catch(err => alert('Backend error: ' + err.message));
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test Backend Connection
        </button>
      </div>

      <div style={{ 
        backgroundColor: '#fff3cd', 
        padding: '15px', 
        borderRadius: '8px',
        margin: '10px 0'
      }}>
        <h3>🔍 Debug Steps</h3>
        <ol>
          <li>Open Chrome Developer Tools (F12)</li>
          <li>Check Console tab for JavaScript errors</li>
          <li>Check Network tab for failed requests</li>
          <li>Look for CORS errors or API connection issues</li>
        </ol>
      </div>

      <div style={{ 
        backgroundColor: '#f8d7da', 
        padding: '15px', 
        borderRadius: '8px',
        margin: '10px 0'
      }}>
        <h3>⚠️ Common Chrome Issues</h3>
        <ul>
          <li>CORS errors when connecting to backend</li>
          <li>Cached old version (try Ctrl+Shift+R)</li>
          <li>JavaScript errors in console</li>
          <li>Ad blockers interfering</li>
        </ul>
      </div>
    </div>
  );
};

export default DebugComponent;