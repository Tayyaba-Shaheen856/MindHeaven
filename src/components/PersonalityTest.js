import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style/PersonalityTest.css';

const questions = [
  // Openness
  {
    id: 1,
    trait: 'Openness',
    question: 'I enjoy thinking about abstract concepts.',
  },
  {
    id: 2,
    trait: 'Openness',
    question: 'I’m full of ideas and enjoy creative projects.',
  },
  {
    id: 3,
    trait: 'Openness',
    question: 'I like to explore new cultures and experiences.',
  },

  // Conscientiousness
  {
    id: 4,
    trait: 'Conscientiousness',
    question: 'I am always prepared and detail-oriented.',
  },
  {
    id: 5,
    trait: 'Conscientiousness',
    question: 'I follow schedules strictly.',
  },
  {
    id: 6,
    trait: 'Conscientiousness',
    question: 'I get chores done right away.',
  },

  // Extraversion
  { id: 7, trait: 'Extraversion', question: 'I am the life of the party.' },
  {
    id: 8,
    trait: 'Extraversion',
    question: 'I feel comfortable around people.',
  },
  {
    id: 9,
    trait: 'Extraversion',
    question: 'I enjoy being the center of attention.',
  },

  // Agreeableness
  {
    id: 10,
    trait: 'Agreeableness',
    question: 'I sympathize with others’ feelings.',
  },
  {
    id: 11,
    trait: 'Agreeableness',
    question: 'I have a soft heart and avoid conflict.',
  },
  { id: 12, trait: 'Agreeableness', question: 'I take time out for others.' },

  // Neuroticism
  { id: 13, trait: 'Neuroticism', question: 'I get stressed out easily.' },
  { id: 14, trait: 'Neuroticism', question: 'I worry about many things.' },
  {
    id: 15,
    trait: 'Neuroticism',
    question: 'I feel anxious or panicky often.',
  },
];

const PersonalityTest = () => {
  const [answers, setAnswers] = useState({});
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const navigate = useNavigate();

  // Load profile on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('http://localhost:5000/api/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.age) setAge(data.age);
        if (data.gender) setGender(data.gender);
        if (data.personality) {
          // Pre-fill answers based on stored personality averages
          const prefill = {};
          questions.forEach((q) => {
            if (data.personality[q.trait]) {
              prefill[q.id] = Math.round(data.personality[q.trait]);
            }
          });
          setAnswers(prefill);
        }
      })
      .catch(err => console.error('Error loading profile:', err));
  }, []);

  // Handle answer selection
  const handleChange = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: parseInt(value) }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!age || !gender) {
      alert('Please fill out age and gender.');
      return;
    }
    if (Object.keys(answers).length !== questions.length) {
      alert('Please answer all questions.');
      return;
    }

    // Calculate averages for each trait
    const traitScores = {};
    questions.forEach((q) => {
      if (!traitScores[q.trait]) traitScores[q.trait] = [];
      traitScores[q.trait].push(answers[q.id]);
    });
    const traitAverages = {};
    for (const trait in traitScores) {
      traitAverages[trait] =
        traitScores[trait].reduce((a, b) => a + b, 0) / traitScores[trait].length;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          age,
          gender,
          personality: traitAverages
        })
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Error saving profile');
        return;
      }

      alert('Profile saved successfully!');
      navigate('/recommendations');
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Something went wrong.');
    }
  };

  return (
    <div className="personality-test">
      <div className="test-background">
        <h1 className="test-heading">Big 5 Personality Test</h1>
        <p className="test-subheading">
          Answer all questions honestly for best recommendations!
        </p>

        <form className="question-form" onSubmit={handleSubmit}>
          {/* Age */}
          <div className="question-block">
            <h3>Age</h3>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>

          {/* Gender */}
          <div className="question-block">
            <h3>Gender</h3>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="">Select Gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Personality Questions */}
          {questions.map((q) => (
            <div className="question-block" key={q.id}>
              <h3>{q.trait}</h3>
              <p>{q.question}</p>
              <div className="options">
                {[1, 2, 3, 4, 5].map((val) => (
                  <label key={val}>
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      value={val}
                      checked={answers[q.id] === val}
                      onChange={(e) => handleChange(q.id, e.target.value)}
                    />
                    {val}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button type="submit" className="submit-btn">
            Save Profile & Get Recommendations
          </button>
        </form>
      </div>
    </div>
  );
};

export default PersonalityTest;
