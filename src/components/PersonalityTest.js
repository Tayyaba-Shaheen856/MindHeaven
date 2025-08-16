import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style/PersonalityTest.css';
// const API_URL = process.env.REACT_APP_API_URL;
const traitEmojis = {
  Openness: '🎨',
  Conscientiousness: '📋',
  Extraversion: '🎉',
  Agreeableness: '🤝',
  Neuroticism: '😬'
};

const questions = [
  { id: 1, trait: 'Openness', question: 'I enjoy thinking about abstract concepts.' },
  { id: 2, trait: 'Openness', question: 'I’m full of ideas and enjoy creative projects.' },
  { id: 3, trait: 'Openness', question: 'I like to explore new cultures and experiences.' },
  { id: 4, trait: 'Conscientiousness', question: 'I am always prepared and detail-oriented.' },
  { id: 5, trait: 'Conscientiousness', question: 'I follow schedules strictly.' },
  { id: 6, trait: 'Conscientiousness', question: 'I get chores done right away.' },
  { id: 7, trait: 'Extraversion', question: 'I am the life of the party.' },
  { id: 8, trait: 'Extraversion', question: 'I feel comfortable around people.' },
  { id: 9, trait: 'Extraversion', question: 'I enjoy being the center of attention.' },
  { id: 10, trait: 'Agreeableness', question: 'I sympathize with others’ feelings.' },
  { id: 11, trait: 'Agreeableness', question: 'I have a soft heart and avoid conflict.' },
  { id: 12, trait: 'Agreeableness', question: 'I take time out for others.' },
  { id: 13, trait: 'Neuroticism', question: 'I get stressed out easily.' },
  { id: 14, trait: 'Neuroticism', question: 'I worry about many things.' },
  { id: 15, trait: 'Neuroticism', question: 'I feel anxious or panicky often.' },
];

const PersonalityTest = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  const totalSteps = questions.length;
  // const API_URL = 'https://upgraded-space-lamp-x5q9xvxq4p6qhvw55-5000.app.github.dev';

  // Handle selection of an answer
  const handleNext = (value) => {
    const questionId = questions[step].id;
    setAnswers(prev => ({ ...prev, [questionId]: value }));

    if (step < totalSteps - 1) setStep(step + 1);
    else handleSubmit();
  };

  // Calculate personality from answers
  const calculatePersonality = () => {
    const traitScores = {};
    questions.forEach(q => {
      if (!traitScores[q.trait]) traitScores[q.trait] = [];
      traitScores[q.trait].push(Number(answers[q.id] || 0));
    });

    const traitAverages = {};
    for (const trait in traitScores) {
      traitAverages[trait] = traitScores[trait].reduce((a, b) => a + b, 0) / traitScores[trait].length;
    }

    const topTrait = Object.entries(traitAverages).sort((a, b) => b[1] - a[1])[0][0];

    const traitToPersonality = {
      Openness: 'Curious',
      Conscientiousness: 'Thoughtful',
      Extraversion: 'Friendly',
      Agreeableness: 'Romantic',
      Neuroticism: 'Adventurous'
    };

    return traitToPersonality[topTrait] || 'Friendly';
  };

  // Submit personality to backend
  const handleSubmit = async () => {
    const personality = calculatePersonality();
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');

    try {
      const res = await fetch("http://localhost:5000/api/auth/profile", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...userData,      // include name, age, gender
          personality       // add personality
        })
      });

      if (!res.ok) {
        const data = await res.json();
        console.error('Error saving profile:', data.error);
        alert(data.error || 'Failed to save personality');
        return;
      }

      // Update localStorage with new personality
      localStorage.setItem('user', JSON.stringify({ ...userData, personality }));

      navigate('/dashboard');
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Something went wrong while saving your personality.');
    }
  };

  const progress = Math.round(((step + 1) / totalSteps) * 100);

  return (
    <div className="quiz-wrapper">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="card">
        <h3>{traitEmojis[questions[step].trait]} {questions[step].trait}</h3>
        <p className="question-text">{questions[step].question}</p>
        <div className="options-grid">
          {[1, 2, 3, 4, 5].map(val => (
            <button
              key={val}
              className={`option-btn ${answers[questions[step].id] === val ? 'selected' : ''}`}
              onClick={() => handleNext(val)}
            >
              {val}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonalityTest;
