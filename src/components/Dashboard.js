import React, { useState } from 'react';
import './style/Dashboard.css';

// Import all pages
import ProfileInfoPage from './ProfileInfoPage';
import RecommendationsPage from './RecommendationsPage';
import MoodTrackingPage from './MoodTrackingPage';
import GoalsTasksPage from './GoalsTasksPage';
import NotesFavesPage from './NotesFavesPage';
import ContactUsPage from './ContactUsPage';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const tabs = [
    { name: 'Profile Info', component: <ProfileInfoPage /> },
    { name: 'Recommendations', component: <RecommendationsPage /> },
    { name: 'Mood Tracking', component: <MoodTrackingPage /> },
    { name: 'Goals & Tasks', component: <GoalsTasksPage /> },
    { name: 'Notes & Faves', component: <NotesFavesPage /> },
    { name: 'Contact Us', component: <ContactUsPage /> },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].name);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/'); // Navigate back to landing page
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="dashboard-title">MindHeaven</h2>
        <ul className="tab-list">
          {tabs.map((tab) => (
            <li
              key={tab.name}
              className={`tab-item ${activeTab === tab.name ? 'active' : ''}`}
              onClick={() => handleTabClick(tab.name)}
            >
              {tab.name}
            </li>
          ))}
        </ul>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="main-content">
        {tabs.find((tab) => tab.name === activeTab)?.component}
      </main>
    </div>
  );
};

export default Dashboard;
