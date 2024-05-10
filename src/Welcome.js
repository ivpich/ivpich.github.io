import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';  // Ensure you have a CSS file for styles

function Welcome({ onJoin }) {
  const navigate = useNavigate();

  const handleJoin = () => {
    onJoin();
    navigate('/profile'); // Redirects the user to the Profile page after joining
  };

  return (
      <div className="welcome-container">
          <img src="/img.png" alt="Shield" className="welcome-image"/>
          <h1>Гильдия - надежные люди всегда нужны</h1>
          <p>Акселерация вашего социального капитала.</p>
          <button onClick={handleJoin} className="join-button">Вступить в Гильдию</button>
      </div>
  );
}

export default Welcome;
