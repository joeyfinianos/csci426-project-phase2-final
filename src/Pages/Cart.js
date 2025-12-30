import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext.js";
import { Link, useNavigate } from "react-router-dom";
import "../assets/Cart.css";

const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);

  const navigate = useNavigate();

  // Calculate total price
  const total = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const shipping = total > 0 ? 3.99 : 0;
  const tax = total * 0.08;
  const finalTotal = total + shipping + tax;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert("Please login to complete your purchase!");
      navigate('/login');
      return;
    }
    
    // Navigate to checkout page
    navigate('/checkout');
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1 className="cart-title">Your Shopping Cart</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">📚</div>
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added any books to your cart yet.</p>
          <Link to="/books" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-content">
          {/* Cart Items */}
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.image}
                  alt={item.name}
                  className="item-image"
                />
                <div className="item-details">
                  <h3 className="item-title">{item.name}</h3>
                  {item.author && <p className="item-author">by {item.author}</p>}
                  {item.genre && <span className="item-genre">{item.genre}</span>}
                  <p className="item-price">${item.price.toFixed(2)} each</p>
                  <p className="item-quantity">Quantity: {item.quantity || 1}</p>
                  <p className="item-subtotal">
                    Subtotal: ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="cart-summary">
            <h3 className="summary-title">Order Summary</h3>
            
            <div className="summary-row">
              <span className="summary-label">Items ({cartItems.length})</span>
              <span className="summary-value">${total.toFixed(2)}</span>
            </div>
            
            <div className="summary-row">
              <span className="summary-label">Shipping</span>
              <span className="summary-value">
                {shipping > 0 ? `$${shipping.toFixed(2)}` : 'Free'}
              </span>
            </div>
            
            <div className="summary-row">
              <span className="summary-label">Tax (8%)</span>
              <span className="summary-value">${tax.toFixed(2)}</span>
            </div>
            
            <div className="summary-total">
              <span className="total-label">Total</span>
              <span className="total-value">${finalTotal.toFixed(2)}</span>
            </div>

            <button 
              onClick={handleCheckout}
              className="checkout-btn"
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </button>
            
            <button 
              onClick={clearCart}
              className="clear-cart-btn"
              disabled={cartItems.length === 0}
            >
              Clear Entire Cart
            </button>
            
            {!localStorage.getItem('token') && (
              <div className="login-notice">
                ⚠️ You need to be logged in to checkout
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;