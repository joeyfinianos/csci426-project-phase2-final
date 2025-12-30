import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/Admin.css";

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalMessages: 0,
    newMessages: 0
  });

  // Check if user is admin (you can enhance this with proper admin authentication)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login to access admin panel");
      navigate('/login');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Fetch orders
      const ordersRes = await fetch('http://localhost:5001/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const ordersData = await ordersRes.json();
      
      // Fetch messages
      const messagesRes = await fetch('http://localhost:5001/api/admin/messages', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const messagesData = await messagesRes.json();

      if (ordersData.success) {
        setOrders(ordersData.orders);
        
        // Calculate stats
        const totalRevenue = ordersData.orders.reduce((sum, order) => sum + parseFloat(order.total_price), 0);
        const pendingOrders = ordersData.orders.filter(order => order.status === 'pending').length;
        
        setStats(prev => ({
          ...prev,
          totalOrders: ordersData.orders.length,
          totalRevenue: totalRevenue,
          pendingOrders: pendingOrders
        }));
      }

      if (messagesData.success) {
        setMessages(messagesData.messages);
        const newMessages = messagesData.messages.filter(msg => msg.status === 'new').length;
        
        setStats(prev => ({
          ...prev,
          totalMessages: messagesData.messages.length,
          newMessages: newMessages
        }));
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      alert('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const result = await response.json();
      if (result.success) {
        alert('Order status updated successfully!');
        fetchData();
      } else {
        alert('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status');
    }
  };

  const updateMessageStatus = async (messageId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/admin/messages/${messageId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const result = await response.json();
      if (result.success) {
        alert('Message status updated successfully!');
        fetchData();
      } else {
        alert('Failed to update message status');
      }
    } catch (error) {
      console.error('Error updating message status:', error);
      alert('Error updating message status');
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/admin/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      if (result.success) {
        alert('Order deleted successfully!');
        fetchData();
      } else {
        alert('Failed to delete order');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Error deleting order');
    }
  };

  const deleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/admin/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      if (result.success) {
        alert('Message deleted successfully!');
        fetchData();
      } else {
        alert('Failed to delete message');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Error deleting message');
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-title">Admin Dashboard</h1>
        <p className="admin-subtitle">Manage orders and customer messages</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>${stats.totalRevenue.toFixed(2)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{stats.pendingOrders}</h3>
            <p>Pending Orders</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📧</div>
          <div className="stat-content">
            <h3>{stats.totalMessages}</h3>
            <p>Total Messages</p>
          </div>
        </div>
        <div className="stat-card new">
          <div className="stat-icon">🔔</div>
          <div className="stat-content">
            <h3>{stats.newMessages}</h3>
            <p>New Messages</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`tab-button ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          Orders ({orders.length})
        </button>
        <button
          className={`tab-button ${activeTab === "messages" ? "active" : ""}`}
          onClick={() => setActiveTab("messages")}
        >
          Messages ({messages.length})
        </button>
      </div>

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div className="admin-content">
          <h2 className="content-title">Orders Management</h2>
          {orders.length === 0 ? (
            <div className="empty-state">
              <p>No orders found</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.full_name}</td>
                      <td>{order.email}</td>
                      <td className="price">${parseFloat(order.total_price).toFixed(2)}</td>
                      <td>
                        <select
                          className={`status-badge ${order.status}`}
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>{new Date(order.order_date).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="action-button view"
                          onClick={() => {
                            alert(`Order Details:\n\nAddress: ${order.address}\nCity: ${order.city}\nState: ${order.state}\nZIP: ${order.zip_code}\nCountry: ${order.country}\nPhone: ${order.phone}\nPayment: ${order.payment_method}\nNotes: ${order.notes || 'None'}`);
                          }}
                        >
                          View
                        </button>
                        <button
                          className="action-button delete"
                          onClick={() => deleteOrder(order.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Messages Tab */}
      {activeTab === "messages" && (
        <div className="admin-content">
          <h2 className="content-title">Contact Messages</h2>
          {messages.length === 0 ? (
            <div className="empty-state">
              <p>No messages found</p>
            </div>
          ) : (
            <div className="messages-grid">
              {messages.map((message) => (
                <div key={message.id} className={`message-card ${message.status}`}>
                  <div className="message-header">
                    <div className="message-info">
                      <h3>{message.full_name}</h3>
                      <p className="message-email">{message.email}</p>
                    </div>
                    <span className={`message-status ${message.status}`}>
                      {message.status}
                    </span>
                  </div>
                  <div className="message-subject">
                    <strong>Subject:</strong> {message.subject}
                  </div>
                  <div className="message-body">
                    <strong>Message:</strong>
                    <p>{message.message}</p>
                  </div>
                  <div className="message-meta">
                    <span className="message-date">
                      {new Date(message.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="message-actions">
                    <select
                      className="status-select"
                      value={message.status}
                      onChange={(e) => updateMessageStatus(message.id, e.target.value)}
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="responded">Responded</option>
                      <option value="archived">Archived</option>
                    </select>
                    <button
                      className="action-button delete"
                      onClick={() => deleteMessage(message.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}