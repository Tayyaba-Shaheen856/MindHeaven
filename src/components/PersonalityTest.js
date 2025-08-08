import React, { useState } from 'react';
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

  const handleChange = (id, value) => {
    setAnswers({ ...answers, [id]: parseInt(value) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (Object.keys(answers).length !== questions.length) {
      alert('Please answer all questions.');
      return;
    }

    // Replace this with navigation or API call later
    alert('Test submitted! Redirecting to Recommendations...');
  };

  return (
    <div className="personality-test">
      <div className="test-background">
        <h1 className="test-heading">Big 5 Personality Test</h1>
        <p className="test-subheading">
          Answer all questions honestly for best recommendations!
        </p>

        <form className="question-form" onSubmit={handleSubmit}>
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
                      onChange={(e) => handleChange(q.id, e.target.value)}
                    />
                    {val}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button type="submit" className="submit-btn">
            Get Recommendations
          </button>
        </form>
      </div>
    </div>
  );
};

export default PersonalityTest;
