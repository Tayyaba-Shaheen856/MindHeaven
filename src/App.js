import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import PersonalityTest from './components/PersonalityTest';
import RecommendationsPage from './components/RecommendationsPage';
import RegisterPage from './components/RegisterPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/test" element={<PersonalityTest />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />
               <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;