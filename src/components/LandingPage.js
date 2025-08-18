import React, { useState } from 'react';
import './style/LandingPage.css';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <div className="landing-page gradient-background">
      {/* Header */}
      <header className="header">
        <div className="logo" onClick={() => navigate('/')}>
          <img src="/images/logo.png" alt="Logo" />
        </div>
        <div className="header-buttons">
          <button className="auth-btn login-btn" onClick={() => navigate('/login')}>
            Login
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section>
        <div className="hero">
          <div className="hero-content">
            <h1 className="hero-title">Discover Your Personality</h1>
            <p className="hero-subtitle">
              Take our personality test and unlock personalized recommendations 
              for music, books, and movies—crafted to match who you truly are.
            </p>
            <button 
              className="auth-btn take-test-btn pulse" 
              onClick={() => setShowInstructions(true)}
            >
              Take Test Now!
            </button>
          </div>
          <div className="hero-badge">
            <img src="/images/badge.png" alt="Personality Test Badge" />
          </div>
        </div>
      </section>

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="instructions-overlay">
          <div className="instructions-modal">
            <h2>How to Take the Test</h2>
            <p>
              This test takes approximately 5-10 minutes.<br />
              Answer honestly and enjoy discovering your personality!
            </p>
            <button 
              className="auth-btn take-test-btn pulse"
              onClick={() => navigate('/personality')}
            >
              I'm Ready!
            </button>
            <button 
              className="close-btn" 
              onClick={() => setShowInstructions(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* About Us Section */}
      <section>
        <div className="about-us">
          <div className="image">
            <img src="/images/scientist.png" alt="Research Illustration" />
          </div>
          <div className="about-us-content">
            <p className="heading">About Us</p>
            <h1 className="about-us-title">About Personality Finder</h1>
            <p className="about-us-subtitle">
              Our platform goes beyond traditional personality types. 
              Using a unique blend of psychology and AI, we help you 
              explore your strengths and discover tailored 
              recommendations that fit your mood, interests, and personality. 
            </p>
            <ul className="about-us-list">
              <li>✔ Scientifically backed personality framework</li>
              <li>✔ AI-powered personalized recommendations</li>
              <li>✔ Continuous updates with new insights</li>
              <li>✔ Free access for everyone, anytime</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us">
        <h2>Why Choose Us</h2>
        <p>
          Our platform goes beyond traditional personality types. 
          Using a unique blend of psychology and AI, we help you explore your strengths 
          and discover tailored recommendations that fit your mood, interests, and personality. 
        </p>
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

      {/* Recommendations Section */}
      <section className="recommendations">
        <h2>Top Recommendations</h2>
        <p>
          Our platform goes beyond traditional personality types. 
          Using a unique blend of psychology and AI, we help you explore your strengths 
          and discover tailored recommendations that fit your mood, interests, and personality. 
        </p>
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

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-overlay"></div>
        <div className="cta-container">
          <div className="cta-image left">
            <img src="/images/imgi_12_blue-personality-min-png.avif" alt="Self Growth" />
          </div>
          <div className="cta-content">
            <h2>Discover Yourself with Personality Finder</h2>
            <p>
              Our platform is designed to help you explore your unique personality 
              using psychology and AI-driven insights.
            </p>
            <p className="cta-highlight">
              Get personalized recommendations in books, music, and movies that match your mood and interests.
            </p>
          </div>
          <div className="cta-image right">
            <img src="/images/imgi_28_0011_mb_thumbs_estp.png" alt="Mind Growth" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        &copy; {new Date().getFullYear()} MindHeaven. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
