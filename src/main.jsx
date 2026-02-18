import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './ErrorBoundary';
import './styles/index.css';

console.log('🚀 Harmony Teacher - Starting...');

try {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
  console.log('✅ React app mounted successfully!');
} catch (error) {
  console.error('❌ Failed to mount React app:', error);
  document.body.innerHTML = `
    <div style="
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #1a1a1a;
      color: white;
      font-family: monospace;
      padding: 40px;
      text-align: center;
    ">
      <div>
        <h1 style="color: #ff6b6b; font-size: 2rem;">⚠️ Critical Error</h1>
        <p style="color: #b0b0b0; margin: 20px 0;">Failed to start app. Check console (F12) for details.</p>
        <pre style="background: #252525; padding: 20px; border-radius: 8px; text-align: left; overflow: auto;">
${error.message}
        </pre>
      </div>
    </div>
  `;
}
