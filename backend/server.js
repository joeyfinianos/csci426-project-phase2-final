const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const ordersRouter = require('./routes/orders');
const contactRouter = require('./routes/contact');
const adminRouter = require('./routes/admin');
const forgotPasswordRouter = require('./routes/forgot-password');

const app = express();
const PORT = 5001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Add your MySQL password if you have one
  database: 'db_bookhaven'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('✅ Connected to MySQL database: db_bookhaven');
});

const JWT_SECRET = 'bookhaven-secret-key-2024';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      error: 'Access token required' 
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        error: 'Invalid or expired token' 
      });
    }
    req.user = user;
    next();
  });
};

// SIGNUP ENDPOINT
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    console.log('Signup request for:', email);

    const checkQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkQuery, [email], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          success: false, 
          error: 'Database error' 
        });
      }

      if (results.length > 0) {
        return res.status(400).json({ 
          success: false, 
          error: 'Email already registered' 
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
      const insertQuery = 'INSERT INTO users (name, email, password, is_admin) VALUES (?, ?, ?, 0)';
      db.query(insertQuery, [name, email, hashedPassword], (err, result) => {
        if (err) {
          console.error('Insert error:', err);
          return res.status(500).json({ 
            success: false, 
            error: 'Failed to create user' 
          });
        }

        const token = jwt.sign(
          { userId: result.insertId, email: email, isAdmin: false },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        res.status(201).json({
          success: true,
          message: 'Account created!',
          token: token,
          user: {
            id: result.insertId,
            name: name,
            email: email,
            isAdmin: false
          }
        });
      });
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// LOGIN ENDPOINT
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt for:', email);

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          success: false, 
          error: 'Database error' 
        });
      }

      if (results.length === 0) {
        return res.status(401).json({ 
          success: false, 
          error: 'Invalid email or password' 
        });
      }

      const user = results[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ 
          success: false, 
          error: 'Invalid email or password' 
        });
      }

      const isAdmin = user.is_admin === 1;

      const token = jwt.sign(
        { userId: user.id, email: user.email, isAdmin: isAdmin },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      console.log(`✅ Login successful for ${email} - Admin: ${isAdmin}`);

      res.json({
        success: true,
        message: 'Login successful!',
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: isAdmin
        }
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET ALL BOOKS ENDPOINT
app.get('/api/books', (req, res) => {
  console.log('📚 Fetching books from database...');
  
  const query = 'SELECT id, name, author, price, genre, image FROM books ORDER BY id';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error fetching books:', err);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch books from database' 
      });
    }
    
    console.log(`✅ Fetched ${results.length} books from database`);
    res.json({
      success: true,
      books: results
    });
  });
});

// GET SINGLE BOOK BY ID
app.get('/api/books/:id', (req, res) => {
  const bookId = req.params.id;
  
  const query = 'SELECT * FROM books WHERE id = ?';
  db.query(query, [bookId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        success: false, 
        error: 'Database error' 
      });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Book not found' 
      });
    }
    
    res.json({
      success: true,
      book: results[0]
    });
  });
});

// USE ROUTERS
app.use('/api/orders', ordersRouter);
app.use('/api/contact', contactRouter);
app.use('/api/admin', adminRouter);
app.use('/api/auth', forgotPasswordRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'BookHaven API is running',
    timestamp: new Date().toISOString()
  });
});

// Test route
app.get('/', (req, res) => {
  res.send('BookHaven Backend is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Orders endpoint: http://localhost:${PORT}/api/orders`);
  console.log(`📧 Contact endpoint: http://localhost:${PORT}/api/contact`);
  console.log(`👤 Admin endpoint: http://localhost:${PORT}/api/admin`);
  console.log(`🔐 Auth endpoint: http://localhost:${PORT}/api/auth`);
});