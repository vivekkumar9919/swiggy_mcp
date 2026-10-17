import React from 'react';

export default function CartDrawer({ cart, onClose, onCheckout }) {
  if (!cart) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      justifyContent: 'flex-end',
      zIndex: 250
    }}>
      <div style={{
        background: '#fff',
        width: '100%',
        maxWidth: 480,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
        animation: 'slideIn 0.3s ease-out'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#FC8019', textTransform: 'uppercase' }}>
              Swiggy Instamart Cart
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1C1C1C' }}>
              {cart.name} Essentials
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#F1F5F9',
              borderRadius: '50%',
              width: 36,
              height: 36,
              fontSize: 18,
              color: '#64748B'
            }}
          >
            ✕
          </button>
        </div>

        {/* Savings banner */}
        <div style={{
          background: '#E8F5E9',
          color: '#2C8B3D',
          padding: '12px 24px',
          fontSize: 13,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          <span>🎉</span> You saved ₹{cart.savings} by cooking at home instead of ordering out!
        </div>

        {/* Cart Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#64748B', marginBottom: 12, textTransform: 'uppercase' }}>
            Mapped Grocery Items ({cart.selectedList.length})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {cart.selectedList.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 12,
                  borderRadius: 10,
                  border: '1px solid #EDF2F7',
                  background: '#F8FAFC'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{item.instamartName}</div>
                  <div style={{ fontSize: 12, color: '#718096' }}>Qty: 1 • Instamart SKU #{10023 + idx}</div>
                </div>
                <div style={{ fontWeight: 800, fontSize: 14, color: '#1C1C1C' }}>
                  ₹{item.price}
                </div>
              </div>
            ))}
          </div>

          {/* Delivery & Timings */}
          <div style={{
            background: '#FFF8E1',
            borderRadius: 10,
            padding: 14,
            marginTop: 20,
            border: '1px solid #FFE082',
            fontSize: 13,
            color: '#795548',
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            <span style={{ fontSize: 20 }}>⚡</span>
            <div>
              <strong>Instant Delivery:</strong> Arriving at your doorstep in <strong>10-15 minutes</strong> via Instamart dark store.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border)', background: '#FAFAFA' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontSize: 14, color: '#64748B' }}>To Pay (incl. delivery)</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#1C1C1C' }}>₹{cart.totalCost}</span>
          </div>

          <button
            onClick={onCheckout}
            style={{
              width: '100%',
              background: '#2C8B3D',
              color: '#fff',
              padding: 14,
              borderRadius: 12,
              fontWeight: 800,
              fontSize: 16,
              boxShadow: '0 4px 14px rgba(44, 139, 61, 0.4)'
            }}
          >
            Place Instamart Order (₹{cart.totalCost}) 🚀
          </button>
        </div>
      </div>
    </div>
  );
}

