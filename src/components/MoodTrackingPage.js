import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './style/MoodTrackingPage.css';

const moodColors = {
  Happy: '#fff59d',
  Sad: '#90caf9',
  Angry: '#ef9a9a',
  Relaxed: '#a5d6a7',
  Excited: '#ffcc80',
  Default: '#8884d8'
};

const moodScale = {
  Angry: 1,
  Sad: 2,
  Neutral: 3,
  Relaxed: 4,
  Happy: 5,
  Excited: 6
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
          console.log("Fetched moods from backend:", data); // 👈 DEBUG LOG
          setEntries(data);
        } else {
          console.error("Error fetching moods:", res.status);
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
        setEntries(prev => [newEntry, ...prev]);
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
        setEntries(prev => [newEntry, ...prev]);
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

  // Convert entries into chart-friendly format
  const chartData = entries
    .filter(e => e.emoji !== '📝 Journal Entry') // exclude journals
    .map(e => {
      const moodValue = moodScale[e.emoji] || 3; // custom moods → Neutral baseline
      return {
        mood: e.emoji,
        moodValue,
        timestamp: new Date(e.timestamp).getTime(), // numeric timestamp
        color: moodColors[e.emoji] || moodColors.Default
      };
    })
    .reverse();

  return (
    <div className="mood-page">
      <h1>Mood Tracking & Journaling</h1>

      {/* Mood selection */}
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

      {/* Journal */}
      <div className="journal-section">
        <textarea
          value={journal}
          onChange={e => setJournal(e.target.value)}
          placeholder="Write your thoughts (max 5000 chars)"
          maxLength={5000}
        />
        <button onClick={submitJournal} disabled={loading}>Save Journal</button>
      </div>

      {/* Mood Graph */}
      <div className="graph-section">
        <h2>Mood Trend</h2>
        {chartData.length === 0 ? (
          <p>No data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(ts) => new Date(ts).toLocaleDateString()}
              />
              <YAxis
                domain={[1, 6]}
                ticks={[1, 2, 3, 4, 5, 6]}
                tickFormatter={(val) =>
                  Object.keys(moodScale).find(key => moodScale[key] === val) || 'Custom'
                }
              />
              <Tooltip
                labelFormatter={(ts) => new Date(ts).toLocaleString()}
                formatter={(val, _name, props) => props.payload.mood}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="moodValue"
                stroke="#8884d8"
                dot={({ cx, cy, payload }) => (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={6}
                    fill={payload.color}
                    stroke="#333"
                  />
                )}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Previous entries */}
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
