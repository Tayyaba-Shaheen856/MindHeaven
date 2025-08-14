import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style/ProfilePage.css";

const ProfilePage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    openness: "",
    conscientiousness: "",
    extraversion: "",
    agreeableness: "",
    neuroticism: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Profile Data:", formData);
    // backend call yahan add karenge baad me

    // navigate to personality page
    navigate("/personality");
  };

  return (
    <div className="profile-page">
      <div className="form-container">
        <h2>Complete Your Profile</h2>
        <form onSubmit={handleSubmit}>
          
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="age"
            placeholder="Enter your age"
            value={formData.age}
            onChange={handleChange}
            required
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <button type="submit">Save Profile</button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;