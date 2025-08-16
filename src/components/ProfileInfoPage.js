import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style/ProfileInfo.css";
// const API_URL = process.env.REACT_APP_API_URL;
// const API_URL = "https://upgraded-space-lamp-x5q9xvxq4p6qhvw55-5000.app.github.dev";

const ProfileInfo = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    dob: "",
    personality: "",
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        const res = await fetch("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();

        setUser({
          name: data.name || "",
          email: data.email || "",
          age: data.age || "",
          gender: data.gender || "",
          dob: data.dob ? new Date(data.dob).toLocaleDateString() : "",
          personality: data.personality || "",
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, [token]);

  // ===== Button Handlers =====
  const handleRetakePersonality = () => {
    navigate("/personality", { state: { user } });
  };

  const handleChangePassword = () => {
    navigate("/reset-password"); // updated to match App.js route
  };

  return (
    <div className="profile-container">
      <h2>Profile Info</h2>
      <div className="profile-details">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Age:</strong> {user.age}</p>
        <p><strong>Gender:</strong> {user.gender}</p>
        <p><strong>DOB:</strong> {user.dob}</p>
        <p><strong>Personality:</strong> {user.personality}</p>
      </div>

      {/* ===== Action Buttons ===== */}
      <div className="profile-actions">
        <button className="btn" onClick={handleRetakePersonality}>
          Retake Personality Test
        </button>
        <button className="btn" onClick={handleChangePassword}>
          Change Password
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;
