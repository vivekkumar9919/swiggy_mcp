import React, { useState } from 'react';

export default function McpStatusModal({ isOpen, onClose, isAuthenticated, token, onRefreshAuth }) {
  const [testResult, setTestResult] = useState(null);
  const [loadingTest, setLoadingTest] = useState(false);

  if (!isOpen) return null;

  const handleTestMcp = async () => {
    setLoadingTest(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/food/test');
      const data = await res.json();
      setTestResult(data);
    } catch (err) {
      setTestResult({ error: err.message });
    } finally {
      setLoadingTest(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 300,
      padding: 20
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        maxWidth: 560,
        width: '100%',
        padding: 28,
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 20, fontWeight: 800 }}>
            Swiggy MCP Connection Status
          </h3>
          <button
            onClick={onClose}
            style={{ background: '#F1F5F9', borderRadius: '50%', width: 32, height: 32, fontSize: 16, color: '#64748B' }}
          >
            ✕
          </button>
        </div>

        {/* Status indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '14px 18px',
          borderRadius: 10,
          background: isAuthenticated ? '#E8F5E9' : '#FFF3E0',
          border: `1px solid ${isAuthenticated ? '#A5D6A7' : '#FFE0B2'}`,
          marginBottom: 20
        }}>
          <span style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: isAuthenticated ? '#2C8B3D' : '#FF9800',
            boxShadow: isAuthenticated ? '0 0 8px #2C8B3D' : 'none'
          }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: isAuthenticated ? '#2C8B3D' : '#E65100' }}>
              {isAuthenticated ? 'Authenticated & Active' : 'Not Connected'}
            </div>
            <div style={{ fontSize: 12, color: '#686B78' }}>
              {isAuthenticated ? 'Session valid for 5 days. Ready to invoke tools.' : 'Log in using your phone and OTP to grant MCP permissions.'}
            </div>
          </div>
          {!isAuthenticated ? (
            <a
              href="/login"
              style={{
                background: '#FC8019',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700
              }}
            >
              Log In via OTP
            </a>
          ) : (
            <button
              onClick={onRefreshAuth}
              style={{
                background: '#fff',
                color: '#2C8B3D',
                border: '1px solid #2C8B3D',
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 700
              }}
            >
              Refresh
            </button>
          )}
        </div>

        {/* Token details if connected */}
        {isAuthenticated && token && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#64748B', marginBottom: 6 }}>
              ACTIVE JWT ACCESS TOKEN:
            </div>
            <div style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: 8,
              padding: 10,
              fontFamily: 'monospace',
              fontSize: 11,
              wordBreak: 'break-all',
              maxHeight: 70,
              overflowY: 'auto',
              color: '#334155'
            }}>
              {token}
            </div>
          </div>
        )}

        {/* Live MCP Tool Test */}
        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: 16
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Test MCP Tool: <code>get_addresses</code></div>
              <div style={{ fontSize: 12, color: '#718096' }}>Calls <code>https://mcp.swiggy.com/food</code> live</div>
            </div>
            <button
              onClick={handleTestMcp}
              disabled={!isAuthenticated || loadingTest}
              style={{
                background: isAuthenticated ? '#2C8B3D' : '#CBD5E0',
                color: '#fff',
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700,
                cursor: isAuthenticated ? 'pointer' : 'not-allowed'
              }}
            >
              {loadingTest ? 'Calling Swiggy...' : 'Run Tool Test'}
            </button>
          </div>

          {testResult && (
            <pre style={{
              background: '#1e1e1e',
              color: '#d4d4d4',
              padding: 12,
              borderRadius: 8,
              fontSize: 11,
              maxHeight: 180,
              overflowY: 'auto',
              marginTop: 10
            }}>
              {JSON.stringify(testResult, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

