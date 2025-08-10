import React, { useState, useEffect } from 'react';
import './style/RecommendationsPage.css';

const RecommendationsPage = () => {
  const [books, setBooks] = useState([]);
  const [music, setMusic] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [topTraits, setTopTraits] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to see recommendations.');
      setLoading(false);
      return;
    }

    fetch('http://localhost:5000/api/recommendations', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (!data.books || !Array.isArray(data.books)) {
          setError(data.error || 'Invalid recommendations format');
        } else {
          setBooks(data.books);
          setMusic(data.music || []);
          const traits = [...new Set(data.books.map(book => book.subject))];
          setTopTraits(traits);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching recommendations:', err);
        setError('Failed to load recommendations.');
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="loading">Loading recommendations...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="recommendations-container">
      <header className="recommendations-header">
        <h1>Your Personalized Recommendations 🎯</h1>
        {topTraits.length > 0 && (
          <p className="top-traits">
            Based on your top traits:{" "}
            {topTraits.map((trait, idx) => (
              <span key={idx} className="trait-badge">{trait}</span>
            ))}
          </p>
        )}
      </header>

      {/* Book Recommendations */}
      <div className="book-grid">
        {books.map((book, idx) => (
          <div key={idx} className="book-card">
            <div className={`trait-label ${book.subject}`}>{book.subject}</div>
            <h3>{book.title}</h3>
            <p className="author">
              {book.author_name.length > 0
                ? book.author_name.join(', ')
                : 'Unknown Author'}
            </p>
            {book.first_publish_year && (
              <p className="year">First Published: {book.first_publish_year}</p>
            )}
          </div>
        ))}
      </div>

      {/* Music Recommendations */}
      <div className="music-section">
        <h2>🎵 Music Picks for You</h2>
        <div className="music-grid">
          {music.map((song, idx) => (
            <div key={idx} className="music-card">
              <h4>{song.title}</h4>
              <p>{song.artist}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendationsPage;
