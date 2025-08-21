import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import ForgotPage from './components/ForgotPage';
import MoodTrackingPage from './components/MoodTrackingPage';
import ProfileTab from './components/ProfileTab';
import RegisterPage from './components/RegisterPage';
import PersonalityTest from './components/PersonalityTest';
import Dashboard from './components/Dashboard';
import ResetPasswordPage from './components/ResetPasswordPage';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot" element={<ForgotPage />} />

        {/* Reset password routes */}
        <Route
          path="/reset-password"
          element={token ? <ResetPasswordPage /> : <Navigate to="/login" />}
        />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        <Route path="/mood" element={<MoodTrackingPage />} />
        <Route path="/profile" element={<ProfileTab />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/personality" element={<PersonalityTest />} />
        <Route
          path="/dashboard/*"
          element={token ? <Dashboard /> : <Navigate to="/login" />}
        />
        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
