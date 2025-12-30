// contact.js - Backend route for handling contact form submissions
const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_bookhaven'
};

// POST /api/contact - Submit a contact form
router.post('/', async (req, res) => {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    
    const { full_name, email, subject, message } = req.body;

    console.log('📧 Received contact form submission:', { full_name, email, subject });

    // Validate request
    if (!full_name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'All fields are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid email address' 
      });
    }

    // Insert into contact_messages table
    const [result] = await connection.execute(
      `INSERT INTO contact_messages 
      (full_name, email, subject, message, status, created_at) 
      VALUES (?, ?, ?, ?, 'new', NOW())`,
      [full_name, email, subject, message]
    );

    const messageId = result.insertId;

    console.log('✅ Contact message saved with ID:', messageId);

    res.status(201).json({
      success: true,
      messageId: messageId,
      message: 'Thank you for your message! We\'ll get back to you soon.'
    });

  } catch (error) {
    console.error('❌ Contact form error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit contact form: ' + error.message
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// GET /api/contact - Get all contact messages
router.get('/', async (req, res) => {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);

    const status = req.query.status;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    let query = 'SELECT * FROM contact_messages';
    let params = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [messages] = await connection.execute(query, params);

    let countQuery = 'SELECT COUNT(*) as total FROM contact_messages';
    if (status) {
      countQuery += ' WHERE status = ?';
    }
    const [countResult] = await connection.execute(
      countQuery, 
      status ? [status] : []
    );

    res.json({
      success: true,
      messages: messages,
      total: countResult[0].total,
      limit: limit,
      offset: offset
    });

  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contact messages'
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// GET /api/contact/:id - Get a specific contact message
router.get('/:id', async (req, res) => {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    const messageId = req.params.id;

    const [messages] = await connection.execute(
      'SELECT * FROM contact_messages WHERE id = ?',
      [messageId]
    );

    if (messages.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }

    res.json({
      success: true,
      message: messages[0]
    });

  } catch (error) {
    console.error('Error fetching contact message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contact message'
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// PATCH /api/contact/:id/status - Update message status
router.patch('/:id/status', async (req, res) => {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    const messageId = req.params.id;
    const { status } = req.body;

    const validStatuses = ['new', 'read', 'responded', 'archived'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    const [result] = await connection.execute(
      'UPDATE contact_messages SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, messageId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }

    console.log(`✅ Message ${messageId} status updated to: ${status}`);

    res.json({
      success: true,
      message: 'Status updated successfully'
    });

  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update message status'
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// DELETE /api/contact/:id - Delete a contact message
router.delete('/:id', async (req, res) => {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    const messageId = req.params.id;

    const [result] = await connection.execute(
      'DELETE FROM contact_messages WHERE id = ?',
      [messageId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }

    console.log(`🗑️ Message ${messageId} deleted`);

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting contact message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete contact message'
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

module.exports = router;