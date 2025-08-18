import React, { useState, useEffect } from "react";
import "./style/Dashboard.css";

// Import all pages
import ProfileInfoPage from "./ProfileInfoPage";
import RecommendationsPage from "./RecommendationsPage";
import MoodTrackingPage from "./MoodTrackingPage";
import GoalsTasksPage from "./GoalsTasksPage";
import NotesFavesPage from "./NotesFavesPage";
import ContactUsPage from "./ContactUsPage";
import { useNavigate, useLocation } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { name: "Profile Info", component: <ProfileInfoPage /> },
    { name: "Recommendations", component: <RecommendationsPage /> },
    { name: "Mood Tracking", component: <MoodTrackingPage /> },
    { name: "Goals & Tasks", component: <GoalsTasksPage /> },
    { name: "Notes & Faves", component: <NotesFavesPage /> },
    { name: "Contact Us", component: <ContactUsPage /> },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].name);
  const [personality, setPersonality] = useState(
    localStorage.getItem("personality") || null
  );

  // Check if redirected from PersonalityTest with updated personality
  useEffect(() => {
    if (location.state?.personality) {
      const newPersonality = location.state.personality;
      setPersonality(newPersonality);
      localStorage.setItem("personality", newPersonality);
    }
  }, [location.state]);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("personality");
    navigate("/"); // Navigate back to landing page
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="dashboard-title">MindHeaven</h2>
        {personality && (
          <p className="user-personality">
            Personality: <strong>{personality}</strong>
          </p>
        )}
        <ul className="tab-list">
          {tabs.map((tab) => (
            <li
              key={tab.name}
              className={`tab-item ${activeTab === tab.name ? "active" : ""}`}
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
