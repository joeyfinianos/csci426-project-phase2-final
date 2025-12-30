// admin.js - Backend routes for admin dashboard
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

// GET /api/admin/orders - Get all orders
router.get('/orders', async (req, res) => {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);

    const [orders] = await connection.execute(
      'SELECT * FROM orders ORDER BY order_date DESC'
    );

    console.log(`✅ Fetched ${orders.length} orders for admin`);

    res.json({
      success: true,
      orders: orders
    });

  } catch (error) {
    console.error('❌ Error fetching orders:', error);
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

// GET /api/admin/orders/:id - Get specific order details
router.get('/orders/:id', async (req, res) => {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    const orderId = req.params.id;

    const [orders] = await connection.execute(
      'SELECT * FROM orders WHERE id = ?',
      [orderId]
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

// PATCH /api/admin/orders/:id/status - Update order status
router.patch('/orders/:id/status', async (req, res) => {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    const orderId = req.params.id;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    const [result] = await connection.execute(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, orderId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    console.log(`✅ Order ${orderId} status updated to: ${status}`);

    res.json({
      success: true,
      message: 'Order status updated successfully'
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update order status'
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// DELETE /api/admin/orders/:id - Delete an order
router.delete('/orders/:id', async (req, res) => {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    const orderId = req.params.id;

    const [result] = await connection.execute(
      'DELETE FROM orders WHERE id = ?',
      [orderId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    console.log(`🗑️ Order ${orderId} deleted by admin`);

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete order'
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// GET /api/admin/messages - Get all contact messages
router.get('/messages', async (req, res) => {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);

    const [messages] = await connection.execute(
      'SELECT * FROM contact_messages ORDER BY created_at DESC'
    );

    console.log(`✅ Fetched ${messages.length} messages for admin`);

    res.json({
      success: true,
      messages: messages
    });

  } catch (error) {
    console.error('❌ Error fetching messages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch messages'
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// GET /api/admin/messages/:id - Get specific message
router.get('/messages/:id', async (req, res) => {
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
    console.error('Error fetching message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch message'
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// PATCH /api/admin/messages/:id/status - Update message status
router.patch('/messages/:id/status', async (req, res) => {
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
      message: 'Message status updated successfully'
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

// DELETE /api/admin/messages/:id - Delete a message
router.delete('/messages/:id', async (req, res) => {
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

    console.log(`🗑️ Message ${messageId} deleted by admin`);

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete message'
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// GET /api/admin/stats - Get dashboard statistics
router.get('/stats', async (req, res) => {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);

    // Get order stats
    const [orderStats] = await connection.execute(
      'SELECT COUNT(*) as total, SUM(total_price) as revenue FROM orders'
    );

    const [pendingOrders] = await connection.execute(
      'SELECT COUNT(*) as count FROM orders WHERE status = "pending"'
    );

    // Get message stats
    const [messageStats] = await connection.execute(
      'SELECT COUNT(*) as total FROM contact_messages'
    );

    const [newMessages] = await connection.execute(
      'SELECT COUNT(*) as count FROM contact_messages WHERE status = "new"'
    );

    res.json({
      success: true,
      stats: {
        totalOrders: orderStats[0].total,
        totalRevenue: parseFloat(orderStats[0].revenue) || 0,
        pendingOrders: pendingOrders[0].count,
        totalMessages: messageStats[0].total,
        newMessages: newMessages[0].count
      }
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

module.exports = router;