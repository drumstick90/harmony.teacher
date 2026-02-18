import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1a1a1a',
          color: 'white',
          fontFamily: 'monospace',
          padding: '40px'
        }}>
          <div style={{ maxWidth: '800px' }}>
            <h1 style={{ color: '#ff6b6b', fontSize: '2rem', marginBottom: '1rem' }}>
              ⚠️ Something went wrong
            </h1>
            <div style={{ 
              background: '#252525', 
              padding: '20px', 
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <pre style={{ color: '#ff6b6b', fontSize: '0.9rem', overflow: 'auto' }}>
                {this.state.error && this.state.error.toString()}
              </pre>
            </div>
            {this.state.errorInfo && (
              <details style={{ 
                background: '#252525', 
                padding: '20px', 
                borderRadius: '8px',
                cursor: 'pointer'
              }}>
                <summary>Stack Trace</summary>
                <pre style={{ 
                  color: '#b0b0b0', 
                  fontSize: '0.8rem', 
                  overflow: 'auto',
                  marginTop: '10px'
                }}>
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: '20px',
                background: '#4ecdc4',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
