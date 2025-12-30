// orders.js - Backend route for handling orders
const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // Add your MySQL password if you have one
  database: 'db_bookhaven'
};

// IMPORTANT: This must match the JWT_SECRET in server.js
const JWT_SECRET = 'bookhaven-secret-key-2024';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('JWT verification error:', err);
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// POST /api/orders - Create a new order
router.post('/', authenticateToken, async (req, res) => {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    
    const { items, total_price, shipping_info, payment_method, notes } = req.body;
    const userId = req.user.userId; // This comes from JWT token (login uses 'userId')

    console.log('📦 Received order data:', { 
      userId, 
      total_price, 
      itemCount: items?.length,
      shipping_info 
    });

    // Validate request
    if (!items || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'No items in order' 
      });
    }

    if (!shipping_info) {
      return res.status(400).json({ 
        success: false, 
        error: 'Shipping information required' 
      });
    }

    // Insert into orders table
    const [orderResult] = await connection.execute(
      `INSERT INTO orders 
      (user_id, total_price, full_name, email, phone, address, city, state, zip_code, country, payment_method, notes, order_date, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), 'pending')`,
      [
        userId, 
        total_price,
        shipping_info.full_name,
        shipping_info.email,
        shipping_info.phone,
        shipping_info.address,
        shipping_info.city,
        shipping_info.state || '',
        shipping_info.zip_code || '',
        shipping_info.country,
        payment_method || 'credit_card',
        notes || ''
      ]
    );

    const orderId = orderResult.insertId;

    console.log('✅ Order created successfully with ID:', orderId);

    res.status(201).json({
      success: true,
      orderId: orderId,
      message: 'Order placed successfully'
    });

  } catch (error) {
    console.error('❌ Order creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create order: ' + error.message
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// GET /api/orders - Get all orders for a user
router.get('/', authenticateToken, async (req, res) => {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    const userId = req.user.userId; // Match login JWT format

    console.log('📋 Fetching orders for user:', userId);

    // Get all orders for this user
    const [orders] = await connection.execute(
      `SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC`,
      [userId]
    );

    res.json({
      success: true,
      orders: orders
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders'
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// GET /api/orders/:id - Get a specific order
router.get('/:id', authenticateToken, async (req, res) => {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    const userId = req.user.userId; // Match login JWT format
    const orderId = req.params.id;

    console.log('📄 Fetching order:', orderId, 'for user:', userId);

    // Get order details
    const [orders] = await connection.execute(
      `SELECT * FROM orders WHERE id = ? AND user_id = ?`,
      [orderId, userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      order: orders[0]
    });

  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order'
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

module.exports = router;