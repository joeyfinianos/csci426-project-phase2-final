import BookCard from "../components/BookCard";
import "../assets/Home.css";
import { Link } from "react-router-dom";

export default function Home() {
  const featuredBooks = [
    {
      id: 1,
      name: "The Midnight Library",
      author: "Matt Haig",
      price: 24.99,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4d_HlSMk_4YMi9PYLoERazA6yyxMesT_BLQ&s",
      genre: "Fiction"
    },
   
    {
      id: 3,
      name: "Project Hail Mary",
      author: "Andy Weir",
      price: 29.99,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRR3dMxZyCduPupLlN6gq0hp3E7Y4jNCzydjg&s",
      genre: "Sci-Fi"
    },
    {
      id: 4,
      name: "The Thursday Murder Club",
      author: "Richard Osman",
      price: 26.50,
      image: "https://m.media-amazon.com/images/I/71VghJxHsnL._AC_UF1000,1000_QL80_.jpg",
      genre: "Mystery"
    }
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Discover Your Next Favorite Book</h1>
          <p className="hero-subtitle">
            Explore thousands of books across all genres. From timeless classics to modern bestsellers, 
            your next great read is just a click away.
          </p>
          <Link to="/books" className="cta-button">
            Explore Collection
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose BookHaven?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3 className="feature-title">Vast Collection</h3>
            <p className="feature-description">
              Over 50,000 books across all genres. From fiction to academic, we have something for every reader.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3 className="feature-title">Free Shipping</h3>
            <p className="feature-description">
              Free delivery on all orders over $25. Fast and reliable shipping to your doorstep.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3 className="feature-title">Curated Picks</h3>
            <p className="feature-description">
              Hand-picked recommendations from our expert librarians and bestselling authors.
            </p>
          </div>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="bestsellers-section">
        <div className="section-header">
          <h2 className="section-title">Featured Bestsellers</h2>
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
            Discover this month's most loved books
          </p>
        </div>
        <div className="bestsellers-grid">
          {featuredBooks.map((book) => (
            <BookCard key={book.id} product={book} />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <h3>50K+</h3>
            <p>Books Available</p>
          </div>
          <div className="stat-item">
            <h3>100+</h3>
            <p>Genres</p>
          </div>
          <div className="stat-item">
            <h3>25K+</h3>
            <p>Happy Readers</p>
          </div>
          <div className="stat-item">
            <h3>15+</h3>
            <p>Years Experience</p>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="newsletter-content">
          <h2 className="newsletter-title">Stay in the Literary Loop</h2>
          <p style={{ fontSize: '1.1rem', opacity: '0.9', marginBottom: '2rem' }}>
            Get weekly book recommendations, author interviews, and exclusive deals delivered to your inbox.
          </p>
          <div className="newsletter-form">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="newsletter-input"
            />
            <button className="newsletter-button">Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  );
}