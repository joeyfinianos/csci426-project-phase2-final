import BookCard from "../components/BookCard";
import "../assets/Books.css";
import { useState, useEffect } from "react";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching books from database...');
      
      // Fetch directly from your backend API
      const response = await fetch('http://localhost:5001/api/books');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success && Array.isArray(data.books)) {
        console.log(`Successfully fetched ${data.books.length} books from database`);
        
        // Format the data properly
        const formattedBooks = data.books.map(book => ({
          id: book.id,
          name: book.name || 'Unknown Title',
          author: book.author || 'Unknown Author',
          price: parseFloat(book.price) || 0.00,
          genre: book.genre || 'General',
          image: book.image || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400'
        }));
        
        setBooks(formattedBooks);
      } else {
        throw new Error('Invalid response format or no books found');
      }
    } catch (err) {
      console.error('Error fetching books from database:', err);
      setError(`Cannot load books: ${err.message}`);
      setBooks([]); // Clear books on error
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="books-container">
        <div className="books-header">
          <h2 className="books-title">Loading Books...</h2>
          <p className="books-subtitle">Fetching data from database</p>
        </div>
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error && books.length === 0) {
    return (
      <div className="books-container">
        <div className="books-header">
          <h2 className="books-title">Database Connection Error</h2>
          <p className="books-subtitle error-text">{error}</p>
          <div className="error-actions">
            <button onClick={fetchBooks} className="retry-btn">
              Retry Connection
            </button>
            <p className="help-text">
              Make sure your backend server is running at http://localhost:5001
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="books-container">
      <div className="books-header">
        <h2 className="books-title">Our Book Collection</h2>
        <p className="books-subtitle">
          Discover literary treasures for every reader
        </p>
      </div>
      
      {books.length > 0 ? (
        <div className="books-grid">
          {books.map((book) => (
            <BookCard key={book.id} product={book} />
          ))}
        </div>
      ) : (
        <div className="no-books">
          <h3>No books available</h3>
          <p>The database is empty or no books were found.</p>
        </div>
      )}
    </div>
  );
}