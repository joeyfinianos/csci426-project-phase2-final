import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./Pages/home";
import Books from "./Pages/Books";
import Contact from "./Pages/contact";
import Admin from "./components/Admin";
import ForgotPassword from "./components/forgot-password";
import { CartProvider } from "./context/CartContext";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Cart from "./Pages/Cart";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { useContext } from "react";
import Checkout from "./Pages/Checkout";

// Private Route - Requires login
const PrivateRoute = ({ children }) => {
  const { isLoggedIn, loading } = useContext(AuthContext);
  
  if (loading) {
    return <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '80vh' 
    }}>Loading...</div>;
  }
  
  return isLoggedIn ? children : <Navigate to="/login" />;
};

// Public Route - Only accessible when NOT logged in
const PublicRoute = ({ children }) => {
  const { isLoggedIn, loading } = useContext(AuthContext);
  
  if (loading) {
    return <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '80vh' 
    }}>Loading...</div>;
  }
  
  return !isLoggedIn ? children : <Navigate to="/home" />;
};

// Admin Route - Requires login AND admin privileges
const AdminRoute = ({ children }) => {
  const { isLoggedIn, user, loading } = useContext(AuthContext);
  
  if (loading) {
    return <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '80vh' 
    }}>Loading...</div>;
  }
  
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  
  if (!user?.isAdmin) {
    alert('Access denied. Admin privileges required.');
    return <Navigate to="/home" />;
  }
  
  return children;
};

function AppContent() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Router>
      {isLoggedIn && <Navbar />}
      <div style={{ minHeight: "80vh" }}>
        <Routes>
          {/* Redirect root to login if not logged in */}
          <Route path="/" element={
            isLoggedIn ? <Navigate to="/home" /> : <Navigate to="/login" />
          } />

          {/* Public Routes - Only accessible when NOT logged in */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          
          <Route path="/signup" element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          } />

          <Route path="/forgot-password" element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          } />

          {/* Private Routes - Require login */}
          <Route path="/home" element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } />
        
          <Route path="/books" element={
            <PrivateRoute>
              <Books />
            </PrivateRoute>
          } />
          
          <Route path="/contact" element={
            <PrivateRoute>
              <Contact />
            </PrivateRoute>
          } />
          
          <Route path="/cart" element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          } />
          
          <Route path="/checkout" element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          } />

          {/* Admin Route - Requires login AND admin privileges */}
          <Route path="/admin" element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;