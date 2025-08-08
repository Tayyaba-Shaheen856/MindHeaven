import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 added for navigation
import './style/RegisterPage.css';

const RegistrationPage = () => {
  const navigate = useNavigate(); // 👈 hook for redirect
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // 👇 yahan tum backend call bhi add kar sakti ho
    console.log('User registered:', formData);

    // Temporary: store in localStorage
    localStorage.setItem('user', JSON.stringify(formData));

    // Redirect to test page
    navigate('/test');
  };

  return (
    <div className="registration-page">
      <div className="form-container">
        <h2>Create Your Account</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;