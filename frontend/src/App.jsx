import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import RecipeView from './components/RecipeView.jsx';
import SmartNudge from './components/SmartNudge.jsx';
import CartDrawer from './components/CartDrawer.jsx';
import McpStatusModal from './components/McpStatusModal.jsx';
import { RECIPES } from './data/recipes.js';

export default function App() {
  const [selectedRecipe, setSelectedRecipe] = useState(RECIPES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [nudgeRecipe, setNudgeRecipe] = useState(null);
  const [activeCart, setActiveCart] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Check auth status on load
  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/token');
      if (res.ok) {
        const data = await res.json();
        setIsAuthenticated(true);
        setToken(data.access_token);
      } else {
        setIsAuthenticated(false);
        setToken(null);
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // When user searches for a dish in Swiggy Food search
  const handleSearchSubmit = () => {
    if (!searchQuery.trim()) return;

    // Check if we have a recipe for the searched query
    const match = RECIPES.find(r => 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (match) {
      // Trigger the Smart Nudge Popup
      setNudgeRecipe(match);
    } else {
      alert(`No recipe found for "${searchQuery}". Showing available recipes.`);
    }
  };

  const handleAcceptNudge = () => {
    if (nudgeRecipe) {
      setSelectedRecipe(nudgeRecipe);
      setNudgeRecipe(null);
      setSearchQuery('');
    }
  };

  const handleCheckout = () => {
    setActiveCart(null);
    setOrderSuccess(true);
    setTimeout(() => setOrderSuccess(false), 5000);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        isAuthenticated={isAuthenticated}
        onOpenAuth={() => setShowAuthModal(true)}
      />

      {/* Hero Banner / Dish Selector Bar */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid var(--border)',
        padding: '12px 20px',
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          overflowX: 'auto'
        }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#718096', whiteSpace: 'nowrap' }}>
            Popular Cravings:
          </span>
          {RECIPES.map(recipe => (
            <button
              key={recipe.id}
              onClick={() => setSelectedRecipe(recipe)}
              style={{
                padding: '8px 16px',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 700,
                whiteSpace: 'nowrap',
                background: selectedRecipe.id === recipe.id ? '#FC8019' : '#F1F5F9',
                color: selectedRecipe.id === recipe.id ? '#fff' : '#475569',
                boxShadow: selectedRecipe.id === recipe.id ? '0 2px 8px rgba(252, 128, 25, 0.3)' : 'none'
              }}
            >
              {recipe.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: Recipe View */}
      <main style={{ flex: 1 }}>
        <RecipeView
          recipe={selectedRecipe}
          onAddToCart={(cartData) => setActiveCart(cartData)}
        />
      </main>

      {/* Smart Nudge Modal */}
      <SmartNudge
        recipe={nudgeRecipe}
        onAccept={handleAcceptNudge}
        onDecline={() => setNudgeRecipe(null)}
      />

      {/* Instamart Cart Drawer */}
      <CartDrawer
        cart={activeCart}
        onClose={() => setActiveCart(null)}
        onCheckout={handleCheckout}
      />

      {/* Auth / MCP Status Modal */}
      <McpStatusModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        isAuthenticated={isAuthenticated}
        token={token}
        onRefreshAuth={checkAuth}
      />

      {/* Order Placed Toast */}
      {orderSuccess && (
        <div style={{
          position: 'fixed',
          top: 80,
          right: 20,
          background: '#2C8B3D',
          color: '#fff',
          padding: '16px 24px',
          borderRadius: 12,
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          zIndex: 999,
          animation: 'popIn 0.3s ease-out'
        }}>
          <span style={{ fontSize: 24 }}>🚀</span>
          <div>
            <div style={{ fontWeight: 800 }}>Instamart Order Placed!</div>
            <div style={{ fontSize: 13, opacity: 0.9 }}>Your ingredients will arrive in 10-15 minutes. Happy cooking!</div>
          </div>
        </div>
      )}
    </div>
  );
}

