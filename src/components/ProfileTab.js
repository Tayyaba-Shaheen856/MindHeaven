import React, { useEffect, useState } from "react";

function ProfileTab({ userId }) {
  const [personality, setPersonality] = useState(null);

  useEffect(() => {
    const fetchPersonality = async () => {
      const res = await fetch(`http://localhost:5000/api/personality/${userId}`);
      const data = await res.json();
      setPersonality(data);
    };
    fetchPersonality();
  }, [userId]);

  return (
    <div>
      <h2>Profile</h2>
      {personality ? (
        <ul>
          <li>Openness: {personality.openness}</li>
          <li>Conscientiousness: {personality.conscientiousness}</li>
          <li>Extraversion: {personality.extraversion}</li>
          <li>Agreeableness: {personality.agreeableness}</li>
          <li>Neuroticism: {personality.neuroticism}</li>
        </ul>
      ) : <p>Loading personality...</p>}
    </div>
  )
}

export default ProfileTab;