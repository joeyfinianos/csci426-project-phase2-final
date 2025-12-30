import { Link, useNavigate } from "react-router-dom";
import "../assets/Navbar.css";
import { useContext } from "react";
import { CartContext } from "../context/CartContext.js";
import { AuthContext } from "../context/AuthContext.js";

export default function Navbar() {
  const { cartItems } = useContext(CartContext);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">BookHaven</Link>
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/Books">Books</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/cart" className="cart-link">
          🛒 Cart ({cartItems.length})
        </Link>
        <button 
          onClick={handleLogout} 
          className="logout-btn"
          style={{
            background: '#ef4444',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            marginLeft: '10px'
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}