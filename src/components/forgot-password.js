import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/Auth.css";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: Verify Code, 3: New Password
  const [formData, setFormData] = useState({
    email: "",
    verificationCode: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
    setSuccess("");
  };

  // Step 1: Send verification code to email
  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/auth/forgot-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess("✅ Verification code sent to your email!");
        setTimeout(() => {
          setStep(2);
          setSuccess("");
        }, 2000);
      } else {
        setError(data.error || "Failed to send verification code");
      }
    } catch (err) {
      setError("Cannot connect to server. Make sure backend is running.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify the code
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.verificationCode) {
      setError("Please enter the verification code");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/auth/verify-code', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: formData.email,
          code: formData.verificationCode 
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess("✅ Code verified! Enter your new password");
        setTimeout(() => {
          setStep(3);
          setSuccess("");
        }, 1500);
      } else {
        setError(data.error || "Invalid verification code");
      }
    } catch (err) {
      setError("Cannot connect to server.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.newPassword || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/auth/reset-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: formData.email,
          code: formData.verificationCode,
          newPassword: formData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess("✅ Password reset successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(data.error || "Failed to reset password");
      }
    } catch (err) {
      setError("Cannot connect to server.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Reset Password</h2>
        <p className="auth-subtitle">
          {step === 1 && "Enter your email to receive a verification code"}
          {step === 2 && "Enter the verification code sent to your email"}
          {step === 3 && "Create a new password for your account"}
        </p>

        {/* Progress Indicator */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '0.5rem', 
          marginBottom: '2rem' 
        }}>
          <div style={{ 
            width: '30px', 
            height: '30px', 
            borderRadius: '50%', 
            background: step >= 1 ? '#667eea' : '#e0e0e0',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>1</div>
          <div style={{ 
            width: '30px', 
            height: '30px', 
            borderRadius: '50%', 
            background: step >= 2 ? '#667eea' : '#e0e0e0',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>2</div>
          <div style={{ 
            width: '30px', 
            height: '30px', 
            borderRadius: '50%', 
            background: step >= 3 ? '#667eea' : '#e0e0e0',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold'
          }}>3</div>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message" style={{
          background: '#d4edda',
          color: '#155724',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          border: '1px solid #c3e6cb'
        }}>{success}</div>}

        {/* Step 1: Enter Email */}
        {step === 1 && (
          <form onSubmit={handleSendCode}>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <button 
              type="submit" 
              className="auth-button"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Verification Code"}
            </button>
          </form>
        )}

        {/* Step 2: Verify Code */}
        {step === 2 && (
          <form onSubmit={handleVerifyCode}>
            <div className="form-group">
              <input
                type="text"
                name="verificationCode"
                placeholder="Enter 6-digit code"
                className="form-input"
                value={formData.verificationCode}
                onChange={handleChange}
                disabled={loading}
                maxLength="6"
                required
              />
            </div>

            <button 
              type="submit" 
              className="auth-button"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>

            <button 
              type="button"
              onClick={() => setStep(1)}
              className="auth-link"
              style={{ 
                marginTop: '1rem',
                width: '100%',
                textAlign: 'center',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              ← Back to email
            </button>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                className="form-input"
                value={formData.newPassword}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                className="form-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <button 
              type="submit" 
              className="auth-button"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <div className="auth-divider">OR</div>

        <div className="auth-switch">
          Remember your password? 
          <button 
            onClick={() => navigate("/login")}
            className="auth-link"
            style={{ 
              background: "none", 
              border: "none",
              cursor: "pointer",
              padding: "0"
            }}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}