import React, { useState } from 'react';

export default function RecipeView({ recipe, onAddToCart }) {
  const [servings, setServings] = useState(recipe.servings || 2);
  const [selectedIngredients, setSelectedIngredients] = useState(() => 
    recipe.ingredients.reduce((acc, ing) => ({ ...acc, [ing.id]: ing.checked }), {})
  );

  const scaleFactor = servings / (recipe.servings || 2);

  const toggleIngredient = (id) => {
    setSelectedIngredients(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedList = recipe.ingredients.filter(ing => selectedIngredients[ing.id]);
  const homeIngredientsCost = selectedList.reduce((sum, ing) => sum + Math.round(ing.price * scaleFactor), 0);
  const estimatedRestaurantCost = Math.round(recipe.restaurantPrice * scaleFactor);
  const savings = Math.max(0, estimatedRestaurantCost - homeIngredientsCost);

  return (
    <div style={{ maxWidth: 840, margin: '24px auto', padding: '0 20px 80px' }}>
      {/* Hero Card */}
      <div style={{
        background: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
        marginBottom: 24,
      }}>
        <div style={{ position: 'relative', height: 280 }}>
          <img
            src={recipe.image}
            alt={recipe.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
          }} />
          <div style={{ position: 'absolute', bottom: 20, left: 24, right: 24, color: '#fff' }}>
            <span style={{
              background: '#2C8B3D',
              padding: '4px 10px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 0.5
            }}>
              {recipe.diet} • {recipe.cuisine}
            </span>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginTop: 8, marginBottom: 4 }}>
              {recipe.name}
            </h1>
            <p style={{ fontSize: 15, opacity: 0.9 }}>
              {recipe.tagline}
            </p>
          </div>
        </div>

        {/* Quick Stats & Servings Adjuster */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 24px',
          borderBottom: '1px solid var(--border)',
          flexWrap: 'wrap',
          gap: 16,
          background: '#FAFAFA'
        }}>
          <div style={{ display: 'flex', gap: 24, fontSize: 13, color: '#4A5568' }}>
            <div>⏱️ <strong>Prep:</strong> {recipe.prepTime}</div>
            <div>🍳 <strong>Cook:</strong> {recipe.cookTime}</div>
            <div>🔥 <strong>Calories:</strong> {recipe.calories}</div>
          </div>

          {/* Servings Adjuster */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#4A5568' }}>Servings:</span>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              border: '1px solid #CBD5E0',
              borderRadius: 8,
              background: '#fff',
              overflow: 'hidden'
            }}>
              <button
                onClick={() => setServings(Math.max(1, servings - 1))}
                style={{ padding: '6px 14px', background: '#fff', fontSize: 16, fontWeight: 'bold' }}
              >
                -
              </button>
              <span style={{ padding: '0 12px', fontWeight: 800, color: '#1A202C' }}>{servings}</span>
              <button
                onClick={() => setServings(servings + 1)}
                style={{ padding: '6px 14px', background: '#fff', fontSize: 16, fontWeight: 'bold' }}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Savings Comparison Card */}
      <div style={{
        background: 'linear-gradient(135deg, #FFF9F2 0%, #FFF3E5 100%)',
        border: '1px solid #FFE0B2',
        borderRadius: 16,
        padding: '20px 24px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#FC8019', textTransform: 'uppercase' }}>
            Cost Savings Calculator
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#1C1C1C', marginTop: 2 }}>
            You save ₹{savings} ({Math.round((savings / estimatedRestaurantCost) * 100)}% saved)!
          </div>
          <div style={{ fontSize: 13, color: '#686B78', marginTop: 2 }}>
            Restaurant delivery order: <strike>₹{estimatedRestaurantCost}</strike> vs Cooking at home: <strong>₹{homeIngredientsCost}</strong>
          </div>
        </div>
        <div style={{
          background: '#2C8B3D',
          color: '#fff',
          padding: '8px 16px',
          borderRadius: 20,
          fontWeight: 800,
          fontSize: 14,
          boxShadow: '0 4px 10px rgba(44, 139, 61, 0.3)'
        }}>
          Save ₹{savings}
        </div>
      </div>

      {/* Ingredients Section */}
      <div style={{
        background: '#fff',
        borderRadius: 16,
        padding: 24,
        boxShadow: 'var(--shadow-sm)',
        marginBottom: 24
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800 }}>🛒 Ingredients Checklist</h3>
            <p style={{ fontSize: 13, color: '#718096' }}>
              Uncheck anything you already have in your pantry
            </p>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#2C8B3D' }}>
            {selectedList.length} of {recipe.ingredients.length} items to order
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {recipe.ingredients.map(ing => {
            const isChecked = !!selectedIngredients[ing.id];
            const scaledQty = Math.round(ing.qty * scaleFactor);
            const scaledPrice = Math.round(ing.price * scaleFactor);

            return (
              <div
                key={ing.id}
                onClick={() => toggleIngredient(ing.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: 10,
                  border: `1px solid ${isChecked ? '#A5D6A7' : '#E2E8F0'}`,
                  background: isChecked ? '#F1F8E9' : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    style={{ width: 18, height: 18, accentColor: '#2C8B3D', cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: isChecked ? '#1C1C1C' : '#888' }}>
                      {ing.name} ({scaledQty} {ing.unit})
                    </div>
                    <div style={{ fontSize: 12, color: '#718096' }}>
                      Mapped to Instamart: <em>{ing.instamartName}</em>
                    </div>
                  </div>
                </div>

                <div style={{ fontWeight: 800, fontSize: 14, color: isChecked ? '#2C8B3D' : '#888' }}>
                  ₹{scaledPrice}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Steps Section */}
      <div style={{
        background: '#fff',
        borderRadius: 16,
        padding: 24,
        boxShadow: 'var(--shadow-sm)',
        marginBottom: 32
      }}>
        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>
          👨‍🍳 Step-by-Step Cooking Guide
        </h3>
        <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {recipe.steps.map((step, idx) => (
            <li key={idx} style={{ fontSize: 14, color: '#2D3748', lineHeight: 1.6 }}>
              {step}
            </li>
          ))}
        </ol>
      </div>

      {/* Floating CTA bar */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#fff',
        borderTop: '1px solid var(--border)',
        padding: '14px 20px',
        boxShadow: '0 -4px 16px rgba(0,0,0,0.08)',
        zIndex: 90
      }}>
        <div style={{
          maxWidth: 840,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16
        }}>
          <div>
            <div style={{ fontSize: 12, color: '#718096', fontWeight: 600 }}>INSTAMART CART TOTAL</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#1C1C1C' }}>
              ₹{homeIngredientsCost} <span style={{ fontSize: 13, color: '#2C8B3D', fontWeight: 700 }}>(Delivery in 10-15m 🚀)</span>
            </div>
          </div>
          <button
            onClick={() => onAddToCart({ ...recipe, selectedList, totalCost: homeIngredientsCost, savings, servings })}
            disabled={selectedList.length === 0}
            style={{
              background: selectedList.length === 0 ? '#CBD5E0' : '#FC8019',
              color: '#fff',
              padding: '14px 32px',
              borderRadius: 12,
              fontWeight: 800,
              fontSize: 15,
              boxShadow: selectedList.length === 0 ? 'none' : '0 4px 14px rgba(252, 128, 25, 0.4)',
              cursor: selectedList.length === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            Add {selectedList.length} Items to Instamart Cart 🛒
          </button>
        </div>
      </div>
    </div>
  );
}

