import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style/NotesFavsPage.css';

const NotesFavesPage = () => {
  const [items, setItems] = useState([]); // { _id, title, content, type: 'note' | 'fave', starred }
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;

    const fetchItems = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/favorites', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const fetchedItems = res.data.map(item => ({
          _id: item._id,
          title: item.title,
          content: item.content,
          type: item.type,           // 'note' or 'fave'
          starred: item.type === 'fave'
        }));

        setItems(fetchedItems);
      } catch (err) {
        console.error('Failed to fetch notes/favorites:', err);
        setItems([]);
      }
    };

    fetchItems();
  }, [token]);

  const addNote = async () => {
    if (!newNoteTitle.trim()) return;

    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/favorites',
        { title: newNoteTitle, content: newNoteContent, type: 'note' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newItem = {
        _id: res.data.favorite._id,
        title: res.data.favorite.title,
        content: res.data.favorite.content,
        type: 'note',
        starred: false
      };

      setItems(prev => [newItem, ...prev]);
      setNewNoteTitle('');
      setNewNoteContent('');
    } catch (err) {
      console.error('Failed to add note:', err);
    }
  };

  const toggleStar = async (id) => {
    const item = items.find(i => i._id === id);
    if (!item || !token) return;

    const newType = item.starred ? 'note' : 'fave';

    try {
      await axios.put(
        `http://localhost:5000/api/auth/favorites/${id}`,
        { type: newType },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setItems(prev =>
        prev.map(i =>
          i._id === id ? { ...i, starred: !i.starred, type: newType } : i
        )
      );
    } catch (err) {
      console.error('Failed to toggle star:', err);
    }
  };

  const deleteItem = async (id) => {
    if (!token) return;
    try {
      await axios.delete(`http://localhost:5000/api/auth/favorites/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setItems(prev => prev.filter(i => i._id !== id));
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  const filteredItems = items.filter(item => {
    if (filter === 'notes' && item.type !== 'note') return false;
    if (filter === 'faves' && item.type !== 'fave') return false;
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="notes-favs-page">
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

      {/* Controls (Search + Filter) */}
      <div className="controls">
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
      <div className="items-container">
        {filteredItems.map(item => (
          <div
            key={item._id}
            className={item.type === 'fave' ? 'fav-card' : 'note-card'}
          >
            <div className="item-header">
              <p><strong>{item.title}</strong></p>
              <div className="item-actions">
                <button
                  className={`star-btn ${item.starred ? 'starred' : ''}`}
                  onClick={() => toggleStar(item._id)}
                  title={item.starred ? 'Unfavorite' : 'Favorite'}
                >
                  ⭐
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deleteItem(item._id)}
                  title="Delete"
                >
                  🗑
                </button>
              </div>
            </div>
            <p>{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesFavesPage;
