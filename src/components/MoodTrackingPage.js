import React, { useEffect, useState } from 'react';
import './style/MoodTrackingPage.css';

const moodColors = {
  Happy: '#fff59d',
  Sad: '#90caf9',
  Angry: '#ef9a9a',
  Relaxed: '#a5d6a7',
  Excited: '#ffcc80',
  Default: '#f0f0f0'
};

const MoodTrackingPage = () => {
  const [mood, setMood] = useState('');
  const [customMood, setCustomMood] = useState('');
  const [journal, setJournal] = useState('');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Fetch previous moods and journal entries
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/mood`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setEntries(data);
        }
      } catch (err) {
        console.error('Error fetching entries:', err);
      }
    };
    fetchEntries();
  }, [API_URL, token]);

  // Submit mood entry
  const submitMood = async () => {
    const moodToSubmit = customMood.trim() || mood;
    if (!moodToSubmit) return alert('Please select or enter a mood');

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/auth/mood`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ emoji: moodToSubmit })
      });

      if (res.ok) {
        const newEntry = await res.json();
        setEntries(prev => [newEntry, ...prev]); // use the full entry object
        setMood('');
        setCustomMood('');
      } else {
        const errData = await res.json();
        alert(errData.error || 'Error saving mood');
      }
    } catch (err) {
      console.error('Error saving mood:', err);
    } finally {
      setLoading(false);
    }
  };

  // Submit journal entry
  const submitJournal = async () => {
    if (!journal.trim()) return alert('Write something first!');
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/auth/mood`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ emoji: '📝 Journal Entry', note: journal })
      });

      if (res.ok) {
        const newEntry = await res.json();
        setEntries(prev => [newEntry, ...prev]); // use the full entry object
        setJournal('');
      } else {
        const errData = await res.json();
        alert(errData.error || 'Error saving journal');
      }
    } catch (err) {
      console.error('Error saving journal:', err);
    } finally {
      setLoading(false);
    }
  };

  const bgColor = moodColors[customMood || mood] || moodColors.Default;

  return (
    <div className="mood-page" style={{ backgroundColor: bgColor }}>
      <h1>Mood Tracking & Journaling</h1>

      <div className="mood-section">
        <select value={mood} onChange={e => setMood(e.target.value)}>
          <option value="">Select Mood</option>
          {Object.keys(moodColors)
            .filter(m => m !== 'Default')
            .map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
        </select>
        <input
          type="text"
          placeholder="Or enter custom mood"
          value={customMood}
          onChange={e => setCustomMood(e.target.value)}
        />
        <button onClick={submitMood} disabled={loading}>Save Mood</button>
      </div>

      <div className="journal-section">
        <textarea
          value={journal}
          onChange={e => setJournal(e.target.value)}
          placeholder="Write your thoughts (max 5000 chars)"
          maxLength={5000}
        />
        <button onClick={submitJournal} disabled={loading}>Save Journal</button>
      </div>

      <div className="entries-section">
        <h2>Previous Entries</h2>
        {entries.length === 0 && <p>No entries yet.</p>}
        <ul>
          {entries.map((entry, idx) => (
            <li key={idx}>
              <strong>{entry.emoji}</strong>{' '}
              {entry.note && <span>- {entry.note}</span>}
              <em style={{ float: 'right', fontSize: '0.8rem' }}>
                {new Date(entry.timestamp).toLocaleString()}
              </em>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MoodTrackingPage;
