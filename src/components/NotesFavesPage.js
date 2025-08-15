import React, { useState, useEffect } from 'react';
import './style/NotesFavsPage.css';

const NotesFavesPage = () => {
  const [items, setItems] = useState([]); // { id, title, content, type: 'note' | 'fave', starred }
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Load items from localStorage (optional)
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('notesFaves')) || [];
    setItems(saved);
  }, []);

  // Save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notesFaves', JSON.stringify(items));
  }, [items]);

  const addNote = () => {
    if (!newNoteTitle.trim()) return;
    const newItem = {
      id: Date.now(),
      title: newNoteTitle,
      content: newNoteContent,
      type: 'note',
      starred: false
    };
    setItems([newItem, ...items]);
    setNewNoteTitle('');
    setNewNoteContent('');
  };

  const toggleStar = (id) => {
    const updated = items.map(item =>
      item.id === id ? { ...item, starred: !item.starred, type: item.starred ? 'note' : 'fave' } : item
    );
    setItems(updated);
  };

  const filteredItems = items.filter(item => {
    if (filter === 'notes' && item.type !== 'note') return false;
    if (filter === 'faves' && item.type !== 'fave') return false;
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="notes-faves-container">
      <h1>Notes & Favorites</h1>

      {/* Add Note */}
      <div className="add-note">
        <input
          type="text"
          placeholder="Title"
          value={newNoteTitle}
          onChange={(e) => setNewNoteTitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          maxLength={5000}
        />
        <button onClick={addNote}>Add Note</button>
      </div>

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Show All</option>
          <option value="notes">Notes</option>
          <option value="faves">Favorites</option>
        </select>
      </div>

      {/* Items List */}
      <div className="items-grid">
        {filteredItems.map(item => (
          <div key={item.id} className="item-card">
            <h3>{item.title}</h3>
            <p>{item.content}</p>
            <button
              className={`star-btn ${item.starred ? 'starred' : ''}`}
              onClick={() => toggleStar(item.id)}
            >
              ⭐
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesFavesPage;
