import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import PersonalityTest from './components/PersonalityTest';
import Dashboard from './components/Dashboard';
import ResetPasswordPage from './components/ResetPasswordPage'; // <-- import reset password page

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/personality"
          element={token ? <PersonalityTest /> : <Navigate to="/login" />}
        />
        <Route
          path="/dashboard/*"
          element={token ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/reset-password"
          element={token ? <ResetPasswordPage /> : <Navigate to="/login" />}
        />
        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
