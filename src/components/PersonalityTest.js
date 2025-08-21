import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./style/PersonalityTest.css";

const traitEmojis = {
  Openness: "🎨",
  Conscientiousness: "📋",
  Extraversion: "🎉",
  Agreeableness: "🤝",
  Neuroticism: "😬",
};

const questions = [
  { id: 1, trait: "Openness", question: "I enjoy thinking about abstract concepts." },
  { id: 2, trait: "Openness", question: "I’m full of ideas and enjoy creative projects." },
  { id: 3, trait: "Openness", question: "I like to explore new cultures and experiences." },
  { id: 4, trait: "Conscientiousness", question: "I am always prepared and detail-oriented." },
  { id: 5, trait: "Conscientiousness", question: "I follow schedules strictly." },
  { id: 6, trait: "Conscientiousness", question: "I get chores done right away." },
  { id: 7, trait: "Extraversion", question: "I am the life of the party." },
  { id: 8, trait: "Extraversion", question: "I feel comfortable around people." },
  { id: 9, trait: "Extraversion", question: "I enjoy being the center of attention." },
  { id: 10, trait: "Agreeableness", question: "I sympathize with others’ feelings." },
  { id: 11, trait: "Agreeableness", question: "I have a soft heart and avoid conflict." },
  { id: 12, trait: "Agreeableness", question: "I take time out for others." },
  { id: 13, trait: "Neuroticism", question: "I get stressed out easily." },
  { id: 14, trait: "Neuroticism", question: "I worry about many things." },
  { id: 15, trait: "Neuroticism", question: "I feel anxious or panicky often." },
];

const traitToPersonality = {
  Openness: "Curious",
  Conscientiousness: "Thoughtful",
  Extraversion: "Friendly",
  Agreeableness: "Romantic",
  Neuroticism: "Adventurous",
};

const PersonalityTest = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const isRetake = !!location.state?.user; //Checks if the user came here for a retake (location.state?.user).
  const totalSteps = questions.length;

  const handleAnswer = (value) => {
    const qId = questions[step].id;
    setAnswers((prev) => ({ ...prev, [qId]: value }));

    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      setFinished(true);
    }
  };

  const calculatePersonality = () => {
    const traitScores = {};
    questions.forEach((q) => {
      if (!traitScores[q.trait]) traitScores[q.trait] = [];
      traitScores[q.trait].push(Number(answers[q.id] || 0));
    });

    const averages = Object.entries(traitScores).map(([trait, values]) => {
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      return { trait, avg };
    });

    averages.sort((a, b) => b.avg - a.avg);
    return traitToPersonality[averages[0].trait] || "Friendly";
  };

  const handleSubmit = async () => {
    const personality = calculatePersonality();
    localStorage.setItem("personality", personality);

    if (isRetake) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/auth/personality", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ personality }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update personality");

        navigate("/dashboard", { replace: true, state: { personality: data.personality } });
      } catch (err) {
        console.error("Error updating personality:", err);
        alert("Failed to update personality: " + err.message);
      }
    } else {
      navigate("/register");
    }
  };

  const progress = Math.round(((step + 1) / totalSteps) * 100);

  return (
    <div className="quiz-wrapper">
      <div className="progress">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>

      {!finished && (
        <div className="card">
          <h3>
            {traitEmojis[questions[step].trait]} {questions[step].trait}
          </h3>
          <p className="question-text">{questions[step].question}</p>
          <div className="options-grid">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                className={`option-btn ${answers[questions[step].id] === val ? "selected" : ""}`}
                onClick={() => handleAnswer(val)}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      )}

      {finished && (
        <div className="instructions-overlay">
          <div className="instructions-modal">
            <h2>We've got your results! 🎉</h2>
            <p>
              {isRetake
                ? "Your new personality will be updated."
                : "Register to find out what matches your vibe ✨"}
            </p>
            <div className="result-buttons">
              <button className="auth-btn take-test-btn pulse" onClick={handleSubmit}>
                {isRetake ? "Update Profile" : "Register Now"}
              </button>
              {!isRetake && (
                <button
                  className="auth-btn already-user-btn"
                  onClick={() => navigate("/login")}
                >
                  Already a user
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalityTest;
