# BookHaven - Online Bookstore

## Project Overview
BookHaven is a full-stack web application for an online bookstore that allows users to browse books, place orders, and contact the store. The application includes user authentication, shopping cart functionality, and an admin dashboard for managing orders and messages.

## Technologies Used

### Frontend
- **React.js** - JavaScript library for building user interfaces
- **React Router** - For navigation and routing
- **Bootstrap** - CSS framework for responsive design
- **JavaScript (ES6+)** - Modern JavaScript features

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MySQL** - Relational database management system
- **JWT (JSON Web Tokens)** - For secure authentication
- **bcryptjs** - Password hashing and encryption
- **CORS** - Cross-Origin Resource Sharing middleware

### Development Tools
- **Git & GitHub** - Version control and code hosting
- **npm** - Package manager

## Features

### User Features
- User registration and login with JWT authentication
- Browse books by genre and category
- View detailed book information
- Shopping cart functionality
- Place orders with shipping information
- Contact form for customer support
- Password reset functionality

### Admin Features
- Admin dashboard for managing orders
- View and update order status
- Manage customer messages
- View sales statistics

## Project Structure

```
csci426-project-phase2-final/
├── backend/
│   ├── routes/
│   │   |
│   │   ├── orders.js         # Order management routes
│   │   ├── contact.js        # Contact form routes
│   │   └── forgot-password.js # Password reset routes
│   ├── server.js             # Main server file
│   └── package.json          # Backend dependencies
├── src/
│   ├── Components/           # React components
│   ├── Pages/               # Page components
│   └── App.js               # Main React component
├── public/                  # Static files
├── README.md               # Project documentation
└── package.json            # Frontend dependencies
```

## Database Schema

### Tables
1. **users** - User account information
2. **books** - Book catalog
3. **orders** - Customer orders
4. **contact_messages** - Customer inquiries

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- Git

### Installation Steps

#### 1. Clone the Repository
```bash
git clone https://github.com/YOUR-USERNAME/csci426-project-phase2-final.git
cd csci426-project-phase2-final
```

#### 2. Set Up the Database
```sql
-- Create database
CREATE DATABASE db_bookhaven;

-- Use the database
USE db_bookhaven;

-- Create users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_admin TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create books table
CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    genre VARCHAR(100),
    image VARCHAR(500),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'credit_card',
    notes TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create contact_messages table
CREATE TABLE contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 3. Install Backend Dependencies
```bash
cd backend
npm install
```

#### 4. Configure Environment Variables
Create a `.env` file in the `backend` folder:
```env
PORT=5001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=db_bookhaven
JWT_SECRET=bookhaven-secret-key-2024
FRONTEND_URL=http://localhost:3000
```

#### 5. Start the Backend Server
```bash
npm start
```
The backend will run on `http://localhost:5001`

#### 6. Install Frontend Dependencies
Open a new terminal:
```bash
cd ..
npm install
```

#### 7. Start the Frontend
```bash
npm start
```
The frontend will run on `http://localhost:3000`

## Deployment

### Backend Deployment (Railway/Render)
The backend is deployed on **[Railway/Render]** at:
- **Backend URL:** `https://your-backend-url.up.railway.app`

### Frontend Deployment
The frontend can be deployed on platforms like Vercel, Netlify, or GitHub Pages.

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/verify-code` - Verify reset code
- `POST /api/auth/reset-password` - Reset password

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get single book

### Orders
- `POST /api/orders` - Create new order (requires authentication)
- `GET /api/orders` - Get user's orders (requires authentication)
- `GET /api/orders/:id` - Get specific order (requires authentication)

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all messages (admin)

### Admin
- `GET /api/admin/orders` - Get all orders
- `PATCH /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/messages` - Get all messages
- `GET /api/admin/stats` - Get dashboard statistics




## Challenges Faced
- Implementing secure JWT authentication
- Handling CORS issues between frontend and backend
- Database schema design for order management
- Deploying backend with environment variables

## Future Enhancements
- Payment gateway integration (Stripe/PayPal)
- Book search and filtering functionality
- Email notifications for orders
- User profile management
- Book reviews and ratings
- Wishlist functionality

## License
This project is for educational purposes as part of CSCI426 Advanced Web Programming course.

## Acknowledgments
- Department of Computer Science and Information Technology
- Course Instructor
- Online resources and documentation

## Contact
For any questions or issues, please contact:
- Email: joeyfenianos@gmail.com
- GitHub: https://github.com/joeyfinianos

---

**Last Updated:** December 31, 2025
