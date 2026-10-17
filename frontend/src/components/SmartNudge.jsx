import React from 'react';

export default function SmartNudge({ recipe, onAccept, onDecline }) {
  if (!recipe) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 200,
      padding: 20
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(16px)',
        borderRadius: 20,
        maxWidth: 440,
        width: '100%',
        padding: 28,
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        animation: 'popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Chef Hat Icon */}
        <div style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
          margin: '0 auto 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 32,
          boxShadow: '0 6px 16px rgba(252, 128, 25, 0.15)'
        }}>
          👨‍🍳
        </div>

        <div style={{
          display: 'inline-block',
          background: '#FFF3E0',
          color: '#E65100',
          fontSize: 12,
          fontWeight: 800,
          padding: '4px 12px',
          borderRadius: 20,
          marginBottom: 10,
          textTransform: 'uppercase',
          letterSpacing: 0.5
        }}>
          CIY AI Agent Suggestion
        </div>

        <h3 style={{ fontSize: 22, fontWeight: 800, color: '#1C1C1C', marginBottom: 8 }}>
          Craving {recipe.name}?
        </h3>
        <p style={{ fontSize: 14, color: '#686B78', lineHeight: 1.5, marginBottom: 20 }}>
          Why pay <strong style={{ color: '#E53935' }}>₹{recipe.restaurantPrice}</strong> ordering out when you can cook it fresh at home in <strong>{recipe.cookTime}</strong> and save up to <strong>₹125</strong>?
        </p>

        {/* Highlight Perks */}
        <div style={{
          background: '#F8FAFC',
          borderRadius: 12,
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-around',
          marginBottom: 24,
          border: '1px solid #EDF2F7'
        }}>
          <div>
            <div style={{ fontSize: 11, color: '#718096', fontWeight: 600 }}>DELIVERY</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#2C8B3D' }}>⚡ 10-15 Mins</div>
          </div>
          <div style={{ borderLeft: '1px solid #E2E8F0' }} />
          <div>
            <div style={{ fontSize: 11, color: '#718096', fontWeight: 600 }}>HEALTH</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#2C8B3D' }}>🥗 100% Fresh</div>
          </div>
          <div style={{ borderLeft: '1px solid #E2E8F0' }} />
          <div>
            <div style={{ fontSize: 11, color: '#718096', fontWeight: 600 }}>EST. SAVING</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#FC8019' }}>💰 ~₹125 Saved</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={onAccept}
            style={{
              background: '#FC8019',
              color: 'white',
              padding: '14px 20px',
              borderRadius: 12,
              fontWeight: 800,
              fontSize: 15,
              boxShadow: '0 4px 14px rgba(252, 128, 25, 0.4)'
            }}
          >
            Show me the Recipe & Ingredients 📖
          </button>
          <button
            onClick={onDecline}
            style={{
              background: 'transparent',
              color: '#718096',
              padding: '10px 20px',
              borderRadius: 12,
              fontWeight: 600,
              fontSize: 13
            }}
          >
            No, I'll order from restaurant
          </button>
        </div>
      </div>
    </div>
  );
}

