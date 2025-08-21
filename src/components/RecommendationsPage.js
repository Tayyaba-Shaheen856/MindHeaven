import React, { useEffect, useState } from 'react';
import './style/RecommendationsPage.css';

const RecommendationsPage = () => {
  const [books, setBooks] = useState([]);
  const [music, setMusic] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState([]);

  const token = localStorage.getItem('token');

  // Fetch recommendations + favorites
  useEffect(() => {
    if (!token) {
      setError('You must be logged in.');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Recommendations
        const recRes = await fetch("http://localhost:5000/api/auth/recommendations", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!recRes.ok) throw new Error("Failed to fetch recommendations.");
        const recData = await recRes.json();

        setBooks(recData.books || []);
        setMusic(recData.songs || []);
        setMovies(recData.movies || []);

        // Favorites
        const favRes = await fetch("http://localhost:5000/api/auth/favorites", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (favRes.ok) {
          const favData = await favRes.json();
          setFavorites(favData.filter(item => item.type === "fave"));
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load recommendations.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Add/remove favorite
  const toggleFavorite = async (item) => {
    if (!token) return;

    try {
      const existing = favorites.find(f => f.title === item.title);

      if (existing) {
        // Remove from DB
        await fetch(`http://localhost:5000/api/auth/favorites/${existing._id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        setFavorites(prev => prev.filter(f => f.title !== item.title));
      } else {
        // Add to DB
        const res = await fetch("http://localhost:5000/api/auth/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: item.title,
            content: item.author || item.artist || item.director || "",
            type: "fave",
          }),
        });

        const data = await res.json();

        setFavorites(prev => [...prev, { ...item, _id: data.favorite._id, type: "fave" }]);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
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
