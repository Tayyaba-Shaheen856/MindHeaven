

import React, { useEffect, useState } from 'react';
import './style/LandingPage.css';
import { Link, useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Backend se check karna ke user logged in hai ya nahi
    const checkAuth = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/check', {
          credentials: 'include', // cookie/session ke liye
        });
        const data = await res.json();
        setIsLoggedIn(data.loggedIn);
      } catch (err) {
        console.error(err);
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setIsLoggedIn(false);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <div className="logo" onClick={() => navigate('/')}>
          <img src="/images/logo.png" alt="Logo" />
        </div>
        <div className="header-buttons">
          {isLoggedIn ? (
            <button className="auth-btn logout-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <>
              <button className="auth-btn register-btn" onClick={() => navigate('/register')}>
                Register
              </button>
              <button className="auth-btn login-btn" onClick={() => navigate('/login')}>
                Login
              </button>
            </>
          )}
        </div>
      </header>

     
      <div className="animated-background">
        {[...Array(20)].map((_, i) => (
          <span key={i} className="bubble"></span>
        ))}
      </div>

      {/* Hero Section */}
      <section className="hero">
        <h1 className="hero-title">Discover Yourself</h1>
        <p className="hero-subtitle">
          Get personalized recommendations based on your unique personality.
        </p>
      </section>

      {/* Recommendations */}
      <section className="recommendations">
        <h2>Top Recommendations</h2>
        <div className="recommendation-cards">
          <div className="recommendation-card">
            <img src="/images/book.jpg" alt="Book Recommendation" />
            <h3>Books</h3>
            <p>Get book suggestions that match your personality traits and interests.</p>
          </div>
          <div className="recommendation-card">
            <img src="/images/music.jpeg" alt="Music Recommendation" />
            <h3>Music</h3>
            <p>Explore music styles and artists tailored to your vibe and energy.</p>
          </div>
          <div className="recommendation-card">
            <img src="/images/movies.jpg" alt="Movies Recommendation" />
            <h3>Movies</h3>
            <p>Enjoy movie picks that align with your personality and preferences.</p>
          </div>
        </div>
      </section>

      {/* Registration CTA */}
      <section className="registration-teaser">
        <div className="registration-teaser-content">
          <h2>Join Now</h2>
          <p>Sign up to unlock personalized content, save your progress, and more!</p>
          <Link to="/register" className="hero-btn">
            Register Today
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose-us">
        <h2>Why Choose Us</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <img src="/icons/accuracy.jpeg" alt="Accuracy Icon" />
            <h4>High Accuracy</h4>
            <p>Our AI-driven personality test provides highly accurate insights.</p>
          </div>
          <div className="feature-card">
            <img src="/icons/free.jpeg" alt="Free Icon" />
            <h4>Totally Free</h4>
            <p>All features and tools are completely free to use — no hidden charges!</p>
          </div>
          <div className="feature-card">
            <img src="/icons/easy.jpg" alt="Easy to Use Icon" />
            <h4>Simple & Easy</h4>
            <p>The test and dashboard are user-friendly and easy to navigate.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        &copy; {new Date().getFullYear()} Personality Finder. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
