import React from 'react';

export default function Header({ searchQuery, setSearchQuery, onOpenAuth, isAuthenticated, onSearchSubmit }) {
  return (
    <header style={{
      background: '#FFFFFF',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
          <div style={{
            background: 'linear-gradient(135deg, #FC8019 0%, #FF5A00 100%)',
            color: '#fff',
            width: 42,
            height: 42,
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            fontWeight: 'bold',
            boxShadow: '0 4px 10px rgba(252, 128, 25, 0.3)'
          }}>
            🍳
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', letterSpacing: -0.5 }}>
              Cook It Yourself
            </div>
            <div style={{ fontSize: 11, color: '#FC8019', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>
              Powered by Swiggy MCP
            </div>
          </div>
        </div>

        {/* Food Search Bar */}
        <form 
          onSubmit={(e) => { e.preventDefault(); onSearchSubmit(); }}
          style={{ flex: 1, maxWidth: 500, position: 'relative' }}
        >
          <input
            type="text"
            placeholder="Craving something? (e.g., Butter Chicken, Pasta, Paneer Tikka)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 18px 12px 42px',
              borderRadius: 30,
              border: '1px solid #E2E8F0',
              background: '#F8FAFC',
              fontSize: 14,
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = '#FC8019'}
            onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
          />
          <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', opacity: 0.5, fontSize: 16 }}>
            🔍
          </span>
        </form>

        {/* MCP Connection Button */}
        <button
          onClick={onOpenAuth}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            borderRadius: 30,
            fontSize: 13,
            fontWeight: 700,
            background: isAuthenticated ? '#E8F5E9' : '#FFF3E0',
            color: isAuthenticated ? '#2C8B3D' : '#E65100',
            border: `1px solid ${isAuthenticated ? '#A5D6A7' : '#FFE0B2'}`,
          }}
        >
          <span style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: isAuthenticated ? '#2C8B3D' : '#FF9800',
            boxShadow: isAuthenticated ? '0 0 6px #2C8B3D' : 'none'
          }} />
          {isAuthenticated ? 'Swiggy MCP Connected' : 'Connect Swiggy MCP'}
        </button>
      </div>
    </header>
  );
}

