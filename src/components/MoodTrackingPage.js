import React, { useState } from "react";
import Picker from "@emoji-mart/react";
import axios from "axios";

const MoodTracker = () => {
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [message, setMessage] = useState("");

  const handleEmojiSelect = async (emoji) => {
    setSelectedEmoji(emoji.native);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/mood",
        { emoji: emoji.native },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.message || "Mood saved!");
    } catch (err) {
      console.error(err);
      setMessage("Error saving mood");
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Track Your Mood</h2>

      <div className="emoji-picker">
        <Picker onEmojiSelect={handleEmojiSelect} />
      </div>

      {selectedEmoji && (
        <p className="form-message">
          You selected: {selectedEmoji}  
        </p>
      )}

      {message && <p className="form-message">{message}</p>}
    </div>
  );
};

export default MoodTracker;
