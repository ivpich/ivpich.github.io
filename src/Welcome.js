import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from './api';

function Welcome({ onJoin, userData }) {
  const navigate = useNavigate();

  const handleJoin = async () => {
    try {
      await createUser({
        user_id: userData.user_id,
        first_name: userData.first_name,
        last_name: userData.last_name,
        bio: ''
      });
      onJoin();
      navigate('/profile');
    } catch (error) {
      console.error('Failed to join:', error.message);
    }
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
