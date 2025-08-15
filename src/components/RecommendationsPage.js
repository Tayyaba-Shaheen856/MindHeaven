import React, { useEffect, useState } from 'react';
import './style/RecommendationsPage.css';

const API_URL = "https://upgraded-space-lamp-x5q9xvxq4p6qhvw55-5000.app.github.dev";

const RecommendationsPage = () => {
  const [books, setBooks] = useState([]);
  const [music, setMusic] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!token) {
        setError('You must be logged in.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/recommendations`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Failed to fetch recommendations.');

        const data = await res.json();

        setBooks(data.books || []);
        setMusic(data.music || []);
        setMovies(data.movies || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load recommendations.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [token]);

  const toggleFavorite = (item) => {
    setFavorites(prev =>
      prev.find(f => f.title === item.title)
        ? prev.filter(f => f.title !== item.title)
        : [...prev, item]
    );
  };

  const renderCard = (item, type) => {
    let link = '#';
    if (type === 'book') link = 'https://www.goodreads.com/';
    if (type === 'music') link = 'https://open.spotify.com/';
    if (type === 'movie') link = 'https://www.netflix.com/';

    return (
      <div key={item.title} className="card">
        <div className="card-header">
          <h3>{item.title}</h3>
          <span
            className={`star ${favorites.find(f => f.title === item.title) ? 'favorited' : ''}`}
            onClick={() => toggleFavorite(item)}
          >
            ★
          </span>
        </div>
        {item.image && <img src={item.image} alt={item.title} />}
        <p>{item.author || item.artist || item.director || ''}</p>
        <a href={link} target="_blank" rel="noopener noreferrer" className="visit-btn">
          Visit
        </a>
      </div>
    );
  };

  if (loading) return <p className="loading">Loading recommendations...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="recommendations-container">
      <h1>Here's what we think you might enjoy! 🎯</h1>

      {/* Books */}
      {books.length > 0 && (
        <>
          <h2>📚 Books</h2>
          <div className="card-grid">
            {books.map(book => renderCard(book, 'book'))}
          </div>
        </>
      )}

      {/* Music */}
      {music.length > 0 && (
        <>
          <h2>🎵 Music</h2>
          <div className="card-grid">
            {music.map(song => renderCard(song, 'music'))}
          </div>
        </>
      )}

      {/* Movies */}
      {movies.length > 0 && (
        <>
          <h2>🎬 Movies</h2>
          <div className="card-grid">
            {movies.map(movie => renderCard(movie, 'movie'))}
          </div>
        </>
      )}

      {/* No recommendations */}
      {books.length === 0 && music.length === 0 && movies.length === 0 && (
        <p>No recommendations available yet. Please complete your personality test!</p>
      )}
    </div>
  );
};

export default RecommendationsPage;
