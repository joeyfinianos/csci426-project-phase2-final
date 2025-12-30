import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/Auth.css";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Login user with context
        login(data.user, data.token);
        
        // Check if user is admin and redirect accordingly
        if (data.user.isAdmin) {
          console.log('✅ Admin login detected!');
          navigate("/admin");
        } else {
          console.log('✅ Regular user login');
          navigate("/home");
        }
      } else {
        setError(data.error || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("Cannot connect to server. Make sure backend is running on port 5001.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your BookHaven account</p>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div style={{ textAlign: "right", marginBottom: "1.5rem" }}>
            <button 
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="auth-link" 
              style={{ 
                fontSize: "0.9rem", 
                background: "none", 
                border: "none",
                cursor: "pointer",
                color: "#667eea",
                textDecoration: "underline"
              }}
            >
              Forgot Password?
            </button>
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="auth-divider">OR</div>

        <div className="auth-switch">
          Don't have an account? 
          <button 
            onClick={() => navigate("/signup")}
            className="auth-link"
            style={{ 
              background: "none", 
              border: "none",
              cursor: "pointer",
              padding: "0"
            }}
          >
            Create Account
          </button>
        </div>

        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <p style={{ fontSize: "0.9rem", color: "#64748b", marginBottom: "0.5rem" }}>
            Backend must be running on port 5001
          </p>
          <p style={{ fontSize: "0.85rem", color: "#94a3b8", fontStyle: "italic" }}>
            💡 Admin: admin@bookhaven.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
}