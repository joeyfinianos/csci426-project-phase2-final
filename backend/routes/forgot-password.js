// forgot-password.js - Backend routes for password reset
// Place this file in: backend/routes/forgot-password.js

const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_bookhaven'
};

// Store verification codes temporarily (in memory)
// In production, use Redis or database
const verificationCodes = new Map();

// Generate 6-digit verification code
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /api/auth/forgot-password - Send verification code
router.post('/forgot-password', async (req, res) => {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    // Check if user exists
    const [users] = await connection.execute(
      'SELECT id, email, name FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No account found with this email'
      });
    }

    const user = users[0];

    // Generate verification code
    const code = generateVerificationCode();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store code
    verificationCodes.set(email, {
      code: code,
      expires: expires,
      verified: false
    });

    console.log(`📧 Verification code for ${email}: ${code}`);
    console.log(`⏰ Code expires in 10 minutes`);

    res.json({
      success: true,
      message: 'Verification code sent! Check your server console.',
      // For development - shows code in response
      devCode: code
    });

  } catch (error) {
    console.error('Error in forgot-password:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process request'
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// POST /api/auth/verify-code - Verify the code
router.post('/verify-code', async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        error: 'Email and code are required'
      });
    }

    const storedData = verificationCodes.get(email);

    if (!storedData) {
      return res.status(400).json({
        success: false,
        error: 'No verification code found. Please request a new one.'
      });
    }

    if (Date.now() > storedData.expires) {
      verificationCodes.delete(email);
      return res.status(400).json({
        success: false,
        error: 'Verification code has expired. Please request a new one.'
      });
    }

    if (storedData.code !== code) {
      return res.status(400).json({
        success: false,
        error: 'Invalid verification code'
      });
    }

    // Mark as verified
    storedData.verified = true;
    verificationCodes.set(email, storedData);

    console.log(`✅ Code verified for ${email}`);

    res.json({
      success: true,
      message: 'Code verified successfully'
    });

  } catch (error) {
    console.error('Error in verify-code:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify code'
    });
  }
});

// POST /api/auth/reset-password - Reset the password
router.post('/reset-password', async (req, res) => {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Email, code, and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters'
      });
    }

    const storedData = verificationCodes.get(email);

    if (!storedData || !storedData.verified) {
      return res.status(400).json({
        success: false,
        error: 'Please verify your code first'
      });
    }

    if (storedData.code !== code) {
      return res.status(400).json({
        success: false,
        error: 'Invalid verification code'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in database
    const [result] = await connection.execute(
      'UPDATE users SET password = ? WHERE email = ?',
      [hashedPassword, email]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Clear verification code
    verificationCodes.delete(email);

    console.log(`✅ Password reset successful for ${email}`);

    res.json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Error in reset-password:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset password'
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

module.exports = router;