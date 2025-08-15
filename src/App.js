import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import PersonalityTest from './components/PersonalityTest';
import RecommendationsPage from './components/RecommendationsPage';
import RegisterPage from './components/RegisterPage';
// import ProfilePage from './components/ProfilePage';
import LoginPage from './components/LoginPage';
import ForgotPage from './components/ForgotPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import MoodTrackingPage from './components/MoodTrackingPage';
import SidebarLayout from './components/SidebarLayout';
import ProfileTab from './components/ProfileTab';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/personality" element={<PersonalityTest />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />
        <Route path="/register" element={<RegisterPage />} />
          {/* <Route path="/profile" element={<ProfilePage />} /> */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot" element={<ForgotPage />} />
        <Route path="/resetpage" element={<ResetPasswordPage />} />
        <Route path="/mood" element={<MoodTrackingPage />} />
        <Route path="/sidebar" element={<SidebarLayout />} />
        <Route path="/profile" element={<ProfileTab />} />
        
        


      </Routes>
    </Router>
  );
}

export default App;