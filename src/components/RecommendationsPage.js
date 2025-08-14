import React, { useEffect, useState } from 'react';
import './style/RecommendationsPage.css';

const recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
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
    </div>
  );
};

export default recommendations;