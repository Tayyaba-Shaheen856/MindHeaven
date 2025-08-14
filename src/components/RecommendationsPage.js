import React, { useEffect, useState } from 'react';
import './style/RecommendationsPage.css';

<<<<<<< HEAD
const recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
=======
const personalityToRecommendations = {
  Friendly: [
    { title: 'Making Friends', author: 'Alice Smith', subject: 'Friendly', first_publish_year: 2019 },
    { title: 'Social Skills 101', author: 'Bob Jones', subject: 'Friendly', first_publish_year: 2021 }
  ],
  Curious: [
    { title: 'The Science of Everything', author: 'Carl Sagan', subject: 'Curious', first_publish_year: 1980 },
    { title: 'Exploring the Universe', author: 'Neil Tyson', subject: 'Curious', first_publish_year: 2015 }
  ],
  Thoughtful: [
    { title: 'Mindful Living', author: 'Jane Doe', subject: 'Thoughtful', first_publish_year: 2018 },
    { title: 'Planning Your Life', author: 'John Smith', subject: 'Thoughtful', first_publish_year: 2020 }
  ],
  Romantic: [
    { title: 'Love Stories', author: 'Emily Bronte', subject: 'Romantic', first_publish_year: 1847 },
    { title: 'Romantic Adventures', author: 'Arthur Conan', subject: 'Romantic', first_publish_year: 1892 }
  ],
  Adventurous: [
    { title: 'Into the Wild', author: 'Jon Krakauer', subject: 'Adventurous', first_publish_year: 1996 },
    { title: 'Around the World', author: 'Marco Polo', subject: 'Adventurous', first_publish_year: 1300 }
  ]
};

const RecommendationsPage = () => {
  const [books, setBooks] = useState([]);
  const [music, setMusic] = useState([]); // can add music later
>>>>>>> a427266 (Update backend and components with latest changes)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/recommendations`, {
          headers: { Authorization: `Bearer ${token}` }
        });

<<<<<<< HEAD
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to fetch recommendations');
        }

        const data = await res.json();
        setRecommendations(data.recommendations || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
=======
    fetch('https://upgraded-space-lamp-x5q9xvxq4p6qhvw55-5000.app.github.dev/api/recommendations', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        // If backend returns personality only
        const personality = data.personality || 'Friendly';
        const recommendations = data.recommendations || personalityToRecommendations[personality] || [];
        const musicData = data.music || [];

        setBooks(recommendations);
        setMusic(musicData);

        const traits = [...new Set(recommendations.map(book => book.subject))];
        setTopTraits(traits);
>>>>>>> a427266 (Update backend and components with latest changes)
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [API_URL, token]);

  if (loading) return <p className="loading">Loading recommendations...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="recommendations-container">
      <div className="recommendations-header">
        <h1>Your Personalized Recommendations 🎯</h1>
<<<<<<< HEAD
        <p className="top-traits">Based on your top traits: 🌟</p>
      </div>

      <div className="book-grid">
        {recommendations.length > 0 ? (
          recommendations.map((rec, i) => (
            <div key={i} className="book-card">
              <h3>{rec.title}</h3>
              <p className="author">{rec.author}</p>
              <p className="year">First Published: {rec.first_publish_year}</p>
            </div>
          ))
        ) : (
          <p className="error">No recommendations found.</p>
        )}
      </div>
=======
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
            <p className="author">{book.author || 'Unknown Author'}</p>
            {book.first_publish_year && <p className="year">First Published: {book.first_publish_year}</p>}
          </div>
        ))}
      </div>

      {/* Music Recommendations */}
      {music.length > 0 && (
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
      )}
>>>>>>> a427266 (Update backend and components with latest changes)
    </div>
  );
};

export default recommendations;